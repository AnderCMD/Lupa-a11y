import { readFile } from "node:fs/promises";
import * as vscode from "vscode";
import { readConfig } from "./config";
import { clearResultCache, lintDocument } from "./linter/engine";
import { SUPPORTED_EXTENSIONS, SUPPORTED_LANGUAGES, languageForPath } from "./linter/flavors";
import { isCritical, mapMessages } from "./linter/mapDiagnostics";
import { findProjectConfig, resetProjectEslint } from "./linter/projectEslint";
import { IGNORE_RULE_COMMAND, LupaCodeActionProvider } from "./ui/codeActionProvider";
import { showExplanation } from "./ui/explanationPanel";
import { LupaHoverProvider } from "./ui/hoverProvider";
import { SHOW_EXPLANATION_COMMAND } from "./ui/render";
import { LupaStatusBar } from "./ui/statusBar";

const SOURCE = "Lupa A11y";
const SELECTOR = SUPPORTED_LANGUAGES.map((language) => ({ language }));
const DEBOUNCE_MS = 500;
const WORKSPACE_GLOB = `**/*.{${SUPPORTED_EXTENSIONS.join(",")}}`;
const WORKSPACE_EXCLUDE =
  "**/{node_modules,dist,build,out,coverage,.git,.next,.nuxt,.svelte-kit,.astro,.output,.vercel,.turbo,.angular}/**";

/** Lo mínimo para analizar: un documento abierto o un archivo leído del disco. */
interface Source {
  uri: vscode.Uri;
  text: string;
  languageId?: string;
  /** `undefined` para archivos que no están abiertos en el editor. */
  doc?: vscode.TextDocument;
}

export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = vscode.languages.createDiagnosticCollection("lupaA11y");
  const output = vscode.window.createOutputChannel(SOURCE);
  const statusBar = new LupaStatusBar(diagnostics);
  const timers = new Map<string, NodeJS.Timeout>();
  const running = new Set<string>();
  const rerun = new Map<string, vscode.TextDocument>();
  /** Archivos analizados por "Analizar el workspace" (se conservan al cerrarse). */
  const scanned = new Set<string>();
  /** Si el último análisis de cada archivo usó la config del proyecto. */
  const usedProject = new Map<string, boolean>();
  // Avisos que se muestran una sola vez por sesión.
  const warned = new Set<string>();
  const reportedUntranslated = new Set<string>();

  function warnOnce(key: string, message: string, statusBarText?: string): void {
    if (warned.has(key)) return;
    warned.add(key);
    output.appendLine(message);
    if (statusBarText) vscode.window.setStatusBarMessage(statusBarText, 8000);
  }

  function isSupported(doc: vscode.TextDocument): boolean {
    if (doc.uri.scheme === "output" || doc.uri.scheme === "vscode-scm") return false;
    const config = readConfig(doc.uri);
    return config.languages.has(doc.languageId);
  }

  /** Analiza y publica los diagnósticos. Devuelve cuántos hubo (o undefined si se omitió). */
  async function analyze(src: Source): Promise<number | undefined> {
    const { uri, text } = src;
    const config = readConfig(uri);
    if (!config.enable) {
      diagnostics.delete(uri);
      return undefined;
    }
    if (text.length > config.maxFileSizeKb * 1024) {
      diagnostics.delete(uri);
      warnOnce(
        `size:${uri}`,
        `Archivo omitido por superar ${config.maxFileSizeKb} KB: ${uri.fsPath}`,
      );
      return undefined;
    }

    const folder = vscode.workspace.getWorkspaceFolder(uri);
    const cwd = folder?.uri.scheme === "file" ? folder.uri.fsPath : undefined;
    const trusted = vscode.workspace.isTrusted;
    if (cwd && config.useProjectEslintConfig && !trusted && (await findProjectConfig(cwd))) {
      warnOnce(
        `trust:${cwd}`,
        "Workspace no confiable: se usa el preset incluido y se ignora la configuración de ESLint del proyecto.",
        "Lupa A11y: workspace no confiable, se usa el preset incluido",
      );
    }

    const version = src.doc?.version;
    const result = await lintDocument({
      text,
      filePath: uri.scheme === "file" ? uri.fsPath : uri.path,
      languageId: src.languageId,
      cwd,
      useProjectConfig: config.useProjectEslintConfig && trusted,
    });
    // El documento cambió o se cerró mientras se analizaba: se descarta; el
    // análisis programado por ese cambio usará el último contenido.
    if (src.doc && (src.doc.isClosed || src.doc.version !== version)) return undefined;

    if (result.projectConfigError) {
      warnOnce(
        `config:${cwd}`,
        `No se pudo cargar la configuración de ESLint del proyecto; se usa el preset incluido. Detalle: ${result.projectConfigError}`,
        "Lupa A11y: no se pudo cargar la config de ESLint, se usa el preset incluido",
      );
    }
    usedProject.set(uri.toString(), result.usedProjectConfig);

    const mapped = mapMessages(result.messages, config.ignoreRules);
    diagnostics.set(
      uri,
      mapped.map((d) => {
        if (!d.translated && !reportedUntranslated.has(d.ruleId)) {
          reportedUntranslated.add(d.ruleId);
          output.appendLine(`Regla sin traducir: ${d.ruleId}`);
        }
        const severity =
          config.criticalRulesAsError && isCritical(d.ruleId)
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
    statusBar.refresh(usedProject);
    return mapped.length;
  }

  /** Una ejecución por documento a la vez; si llega otra, se repite con lo último. */
  async function lint(doc: vscode.TextDocument): Promise<void> {
    if (!isSupported(doc)) return;
    const key = doc.uri.toString();
    if (running.has(key)) {
      rerun.set(key, doc);
      return;
    }
    running.add(key);
    try {
      await analyze({ uri: doc.uri, text: doc.getText(), languageId: doc.languageId, doc });
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
    if (!isSupported(doc)) return;
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

  async function lintFromDisk(uri: vscode.Uri): Promise<number | undefined> {
    const text = await readFile(uri.fsPath, "utf8");
    return analyze({ uri, text });
  }

  async function analyzeWorkspace(): Promise<void> {
    if (!vscode.workspace.workspaceFolders?.length) {
      void vscode.window.showInformationMessage("Lupa A11y: abre una carpeta para analizarla.");
      return;
    }
    const max = readConfig().workspaceMaxFiles;
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Lupa A11y: analizando el workspace",
        cancellable: true,
      },
      async (progress, token) => {
        const { languages } = readConfig();
        const files = (
          await vscode.workspace.findFiles(WORKSPACE_GLOB, WORKSPACE_EXCLUDE, max + 1, token)
        ).filter((uri) => {
          const language = languageForPath(uri.fsPath);
          return language === undefined || languages.has(language);
        });
        if (files.length > max) {
          output.appendLine(
            `Se analizan solo los primeros ${max} archivos (ajusta lupaA11y.workspaceMaxFiles).`,
          );
        }
        const open = new Map(vscode.workspace.textDocuments.map((d) => [d.uri.toString(), d]));
        let problems = 0;
        let withProblems = 0;
        let done = 0;
        const list = files.slice(0, max);
        for (const uri of list) {
          if (token.isCancellationRequested) break;
          progress.report({
            message: `${done}/${list.length}`,
            increment: 100 / Math.max(list.length, 1),
          });
          try {
            const doc = open.get(uri.toString());
            const n = doc
              ? (await lint(doc), diagnostics.get(uri)?.length)
              : await lintFromDisk(uri);
            if (!doc) scanned.add(uri.toString());
            if (n) {
              problems += n;
              withProblems++;
            }
          } catch (error) {
            output.appendLine(`Error al analizar ${uri.fsPath}: ${String(error)}`);
          }
          done++;
          // Cede el hilo para que el editor siga respondiendo.
          if (done % 20 === 0) await new Promise((r) => setImmediate(r));
        }
        const summary = `Lupa A11y: ${problems} problema${problems === 1 ? "" : "s"} en ${withProblems} de ${done} archivos.`;
        output.appendLine(summary);
        const choice = await vscode.window.showInformationMessage(summary, "Ver problemas");
        if (choice) await vscode.commands.executeCommand("workbench.actions.view.problems");
      },
    );
  }

  async function clearWorkspaceResults(): Promise<void> {
    for (const key of scanned) diagnostics.delete(vscode.Uri.parse(key));
    scanned.clear();
    statusBar.refresh(usedProject);
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
    statusBar,
    configWatcher,
    configWatcher.onDidChange(onProjectConfigChanged),
    configWatcher.onDidCreate(onProjectConfigChanged),
    configWatcher.onDidDelete(onProjectConfigChanged),
    vscode.workspace.onDidOpenTextDocument((d) => void lint(d)),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.contentChanges.length === 0) return;
      if (readConfig(e.document.uri).lintOn === "type") schedule(e.document);
    }),
    vscode.workspace.onDidSaveTextDocument((d) => void lint(d)),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      const key = doc.uri.toString();
      clearTimeout(timers.get(key));
      timers.delete(key);
      rerun.delete(key);
      clearResultCache(doc.uri.scheme === "file" ? doc.uri.fsPath : doc.uri.path);
      // Los archivos del análisis del workspace siguen en Problems, con el contenido del disco.
      if (scanned.has(key) && doc.uri.scheme === "file") {
        void lintFromDisk(doc.uri).catch(() => diagnostics.delete(doc.uri));
      } else {
        diagnostics.delete(doc.uri);
        usedProject.delete(key);
      }
      statusBar.refresh(usedProject);
    }),
    vscode.window.onDidChangeActiveTextEditor(() => statusBar.refresh(usedProject)),
    vscode.languages.onDidChangeDiagnostics(() => statusBar.refresh(usedProject)),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (!e.affectsConfiguration("lupaA11y")) return;
      clearResultCache();
      diagnostics.clear();
      scanned.clear();
      lintAllOpen();
    }),
    vscode.workspace.onDidGrantWorkspaceTrust(() => {
      warned.clear();
      clearResultCache();
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
    vscode.commands.registerCommand("lupaA11y.analyzeWorkspace", analyzeWorkspace),
    vscode.commands.registerCommand("lupaA11y.clearWorkspaceResults", clearWorkspaceResults),
    vscode.commands.registerCommand(IGNORE_RULE_COMMAND, async (ruleId: unknown) => {
      if (typeof ruleId !== "string") return;
      const target = vscode.workspace.workspaceFolders?.length
        ? vscode.ConfigurationTarget.Workspace
        : vscode.ConfigurationTarget.Global;
      const cfg = vscode.workspace.getConfiguration("lupaA11y");
      const current = cfg.get<string[]>("ignoreRules", []);
      if (current.includes(ruleId)) return;
      await cfg.update("ignoreRules", [...current, ruleId], target);
      vscode.window.setStatusBarMessage(`Lupa A11y: ${ruleId} ignorada`, 5000);
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
  statusBar.refresh(usedProject);
}

export function deactivate(): void {}
