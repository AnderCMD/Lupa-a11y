import * as vscode from "vscode";
import { SUPPORTED_LANGUAGES } from "../linter/flavors";

const LANGUAGES = new Set(SUPPORTED_LANGUAGES);

/** Contador de problemas del archivo activo y origen de las reglas. */
export class LupaStatusBar implements vscode.Disposable {
  private readonly item = vscode.window.createStatusBarItem(
    "lupaA11y.status",
    vscode.StatusBarAlignment.Right,
    100,
  );

  constructor(private readonly diagnostics: vscode.DiagnosticCollection) {
    this.item.name = "Lupa A11y";
    this.item.command = "workbench.actions.view.problems";
  }

  refresh(usedProject: ReadonlyMap<string, boolean>): void {
    const editor = vscode.window.activeTextEditor;
    const enabled = vscode.workspace.getConfiguration("lupaA11y").get<boolean>("enable", true);
    if (!editor || !LANGUAGES.has(editor.document.languageId)) {
      this.item.hide();
      return;
    }
    if (!enabled) {
      this.item.text = "$(eye-closed) A11y";
      this.item.tooltip = "Lupa A11y está desactivado. Clic: ver Problems.";
      this.item.show();
      return;
    }
    const uri = editor.document.uri;
    const count = this.diagnostics.get(uri)?.length ?? 0;
    const origin = usedProject.get(uri.toString())
      ? "configuración de ESLint del proyecto"
      : "preset incluido";
    this.item.text = count ? `$(eye) A11y: ${count}` : "$(eye) A11y $(check)";
    this.item.tooltip = new vscode.MarkdownString(
      `**Lupa A11y**\n\n${
        count === 0
          ? "Sin problemas de accesibilidad en este archivo."
          : `${count} problema${count === 1 ? "" : "s"} de accesibilidad en este archivo.`
      }\n\nReglas: ${origin}. Clic para abrir Problems.`,
    );
    this.item.accessibilityInformation = {
      label: `Lupa A11y: ${count} problemas de accesibilidad`,
    };
    this.item.show();
  }

  dispose(): void {
    this.item.dispose();
  }
}
