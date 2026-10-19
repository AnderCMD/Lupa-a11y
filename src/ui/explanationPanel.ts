import { randomBytes } from "node:crypto";
import * as vscode from "vscode";
import { getExplanation } from "../i18n";
import { renderPanelHtml } from "./render";

let panel: vscode.WebviewPanel | undefined;

export function showExplanation(context: vscode.ExtensionContext, ruleId: string): void {
  const explanation = getExplanation(ruleId);
  if (!explanation) {
    void vscode.window.showInformationMessage(
      `Lupa A11y: todavía no hay explicación en español para ${ruleId}.`,
    );
    return;
  }
  const brandRoot = vscode.Uri.joinPath(context.extensionUri, "assets", "brand");
  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      "lupaA11yExplanation",
      "Lupa A11y",
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      { enableScripts: false, localResourceRoots: [brandRoot] },
    );
    panel.onDidDispose(() => (panel = undefined), null, context.subscriptions);
  }
  panel.title = `Lupa A11y: ${explanation.titulo}`;
  panel.webview.html = renderPanelHtml(explanation, {
    cspSource: panel.webview.cspSource,
    logoUri: panel.webview.asWebviewUri(vscode.Uri.joinPath(brandRoot, "logo-mark.svg")).toString(),
    nonce: randomBytes(16).toString("base64"),
  });
  panel.reveal(vscode.ViewColumn.Beside, true);
}
