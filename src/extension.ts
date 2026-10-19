import * as vscode from "vscode";
import { readConfig } from "./config";
import { lintDocument } from "./linter/engine";
import { CRITICAL_RULES, mapMessages } from "./linter/mapDiagnostics";
import { findProjectConfig, resetProjectEslint } from "./linter/projectEslint";
import { LupaCodeActionProvider } from "./ui/codeActionProvider";
import { showExplanation } from "./ui/explanationPanel";
import { LupaHoverProvider } from "./ui/hoverProvider";
import { SHOW_EXPLANATION_COMMAND } from "./ui/render";

const SOURCE = "Lupa A11y";
const LANGUAGES = new Set(["javascriptreact", "typescriptreact"]);
const SELECTOR = [...LANGUAGES].map((language) => ({ language }));
const DEBOUNCE_MS = 500;

export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = vscode.languages.createDiagnosticCollection("lupaA11y");
  const output = vscode.window.createOutputChannel(SOURCE);
  const timers = new Map<string, NodeJS.Timeout>();
  const running = new Set<string>();
  const rerun = new Map<string, vscode.TextDocument>();
  // Avisos que se muestran una sola vez por sesión.
  const warned = new Set<string>();
  const reportedUntranslated = new Set<string>();

  function warnOnce(key: string, message: string, statusBar?: string): void {
    if (warned.has(key)) return;
    warned.add(key);
    output.appendLine(message);
    if (statusBar) vscode.window.setStatusBarMessage(statusBar, 8000);
  }

  async function lintOnce(doc: vscode.TextDocument): Promise<void> {
    const config = readConfig(doc.uri);
    if (!config.enable) {
      diagnostics.delete(doc.uri);
      return;
    }
    if (doc.getText().length > config.maxFileSizeKb * 1024) {
      diagnostics.delete(doc.uri);
      warnOnce(
        `size:${doc.uri}`,
        `Archivo omitido por superar ${config.maxFileSizeKb} KB: ${doc.fileName}`,
      );
      return;
    }

    const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
    const cwd = folder?.uri.scheme === "file" ? folder.uri.fsPath : undefined;
    const trusted = vscode.workspace.isTrusted;
    if (cwd && config.useProjectEslintConfig && !trusted && (await findProjectConfig(cwd))) {
      warnOnce(
        `trust:${cwd}`,
        "Workspace no confiable: se usa el preset incluido y se ignora la configuración de ESLint del proyecto.",
        "Lupa A11y: workspace no confiable, se usa el preset incluido",
      );
    }

    const version = doc.version;
    const result = await lintDocument({
      text: doc.getText(),
      filePath: doc.fileName,
      languageId: doc.languageId,
      cwd,
      useProjectConfig: config.useProjectEslintConfig && trusted,
    });
    // El documento cambió o se cerró mientras se analizaba: se descarta; el
    // análisis programado por ese cambio usará el último contenido.
    if (doc.isClosed || doc.version !== version) return;

    if (result.projectConfigError) {
      warnOnce(
        `config:${cwd}`,
        `No se pudo cargar la configuración de ESLint del proyecto; se usa el preset incluido. Detalle: ${result.projectConfigError}`,
        "Lupa A11y: no se pudo cargar la config de ESLint, se usa el preset incluido",
      );
    }

    diagnostics.set(
      doc.uri,
      mapMessages(result.messages, config.ignoreRules).map((d) => {
        if (!d.translated && !reportedUntranslated.has(d.ruleId)) {
          reportedUntranslated.add(d.ruleId);
          output.appendLine(`Regla sin traducir: ${d.ruleId}`);
        }
        const severity =
          config.criticalRulesAsError && CRITICAL_RULES.includes(d.ruleId)
            ? vscode.DiagnosticSeverity.Error
            : config.severity;
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(d.startLine, d.startCharacter, d.endLine, d.endCharacter),
          d.message,
          severity,
        );
        diagnostic.source = SOURCE;
        diagnostic.code = { value: d.ruleId, target: vscode.Uri.parse(d.docsUrl) };
        return diagnostic;
      }),
    );
  }

  /** Una ejecución por documento a la vez; si llega otra, se repite con lo último. */
  async function lint(doc: vscode.TextDocument): Promise<void> {
    if (!LANGUAGES.has(doc.languageId)) return;
    const key = doc.uri.toString();
    if (running.has(key)) {
      rerun.set(key, doc);
      return;
    }
    running.add(key);
    try {
      await lintOnce(doc);
    } catch (error) {
      // Un fallo inesperado no debe romper la extensión ni llenar de ruido.
      diagnostics.delete(doc.uri);
      output.appendLine(`Error al analizar ${doc.fileName}: ${String(error)}`);
    } finally {
      running.delete(key);
      const next = rerun.get(key);
      if (next) {
        rerun.delete(key);
        void lint(next);
      }
    }
  }

  function schedule(doc: vscode.TextDocument): void {
    if (!LANGUAGES.has(doc.languageId)) return;
    const key = doc.uri.toString();
    clearTimeout(timers.get(key));
    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key);
        void lint(doc);
      }, DEBOUNCE_MS),
    );
  }

  function lintAllOpen(): void {
    vscode.workspace.textDocuments.forEach((d) => void lint(d));
  }

  const configWatcher = vscode.workspace.createFileSystemWatcher("**/eslint.config.*");
  const onProjectConfigChanged = (): void => {
    resetProjectEslint();
    warned.forEach((k) => k.startsWith("config:") && warned.delete(k));
    lintAllOpen();
  };

  context.subscriptions.push(
    diagnostics,
    output,
    configWatcher,
    configWatcher.onDidChange(onProjectConfigChanged),
    configWatcher.onDidCreate(onProjectConfigChanged),
    configWatcher.onDidDelete(onProjectConfigChanged),
    vscode.workspace.onDidOpenTextDocument((d) => void lint(d)),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (readConfig(e.document.uri).lintOn === "type") schedule(e.document);
    }),
    vscode.workspace.onDidSaveTextDocument((d) => void lint(d)),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      const key = doc.uri.toString();
      clearTimeout(timers.get(key));
      timers.delete(key);
      rerun.delete(key);
      diagnostics.delete(doc.uri);
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration("lupaA11y")) return;
      diagnostics.clear();
      lintAllOpen();
    }),
    vscode.workspace.onDidGrantWorkspaceTrust(() => {
      warned.clear();
      diagnostics.clear();
      lintAllOpen();
    }),
    vscode.commands.registerCommand("lupaA11y.toggle", async () => {
      const cfg = vscode.workspace.getConfiguration("lupaA11y");
      await cfg.update(
        "enable",
        !cfg.get<boolean>("enable", true),
        vscode.ConfigurationTarget.Global,
      );
    }),
    vscode.languages.registerHoverProvider(SELECTOR, new LupaHoverProvider()),
    vscode.languages.registerCodeActionsProvider(
      SELECTOR,
      new LupaCodeActionProvider(),
      LupaCodeActionProvider.metadata,
    ),
    vscode.commands.registerCommand(SHOW_EXPLANATION_COMMAND, (ruleId: unknown) => {
      if (typeof ruleId === "string") showExplanation(context, ruleId);
    }),
    { dispose: () => timers.forEach((t) => clearTimeout(t)) },
  );

  lintAllOpen();
}

export function deactivate(): void {}
