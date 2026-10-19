import * as vscode from "vscode";
import { getExplanation } from "../i18n";
import { SHOW_EXPLANATION_COMMAND, renderHoverMarkdown } from "./render";

export const DIAGNOSTIC_SOURCE = "Lupa A11y";

/** Devuelve el ruleId de un diagnóstico de Lupa A11y, o undefined. */
export function ruleIdOf(d: vscode.Diagnostic): string | undefined {
  if (d.source !== DIAGNOSTIC_SOURCE) return undefined;
  const code = d.code;
  if (typeof code === "object" && code !== null) return String(code.value);
  return code === undefined ? undefined : String(code);
}

export class LupaHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
    const contents: vscode.MarkdownString[] = [];
    for (const d of vscode.languages.getDiagnostics(document.uri)) {
      if (!d.range.contains(position)) continue;
      const ruleId = ruleIdOf(d);
      const explanation = ruleId ? getExplanation(ruleId) : undefined;
      if (!explanation) continue;
      const md = new vscode.MarkdownString(renderHoverMarkdown(explanation));
      // Solo se habilita el comando propio, nunca otros.
      md.isTrusted = { enabledCommands: [SHOW_EXPLANATION_COMMAND] };
      contents.push(md);
    }
    return contents.length ? new vscode.Hover(contents) : undefined;
  }
}
