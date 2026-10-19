import * as vscode from "vscode";
import { getFixes } from "../fixes";
import { getExplanation } from "../i18n";
import { ruleIdOf } from "./hoverProvider";
import { SHOW_EXPLANATION_COMMAND } from "./render";

export class LupaCodeActionProvider implements vscode.CodeActionProvider {
  static readonly metadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
  };

  provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    const fixes: vscode.CodeAction[] = [];
    const explanations: vscode.CodeAction[] = [];
    const seenFixes = new Set<string>();
    const seenRules = new Set<string>();
    const text = document.getText();

    for (const d of context.diagnostics) {
      const ruleId = ruleIdOf(d);
      if (!ruleId) continue;

      for (const fix of getFixes(ruleId, text, document.offsetAt(d.range.start))) {
        const key = JSON.stringify([fix.title, fix.edits]);
        if (seenFixes.has(key)) continue;
        seenFixes.add(key);
        const action = new vscode.CodeAction(fix.title, vscode.CodeActionKind.QuickFix);
        action.diagnostics = [d];
        action.isPreferred = fix.preferred === true;
        action.edit = new vscode.WorkspaceEdit();
        for (const e of fix.edits) {
          action.edit.replace(
            document.uri,
            new vscode.Range(document.positionAt(e.start), document.positionAt(e.end)),
            e.newText,
          );
        }
        fixes.push(action);
      }

      if (!seenRules.has(ruleId) && getExplanation(ruleId)) {
        seenRules.add(ruleId);
        const action = new vscode.CodeAction("Ver explicación", vscode.CodeActionKind.QuickFix);
        action.diagnostics = [d];
        action.command = {
          command: SHOW_EXPLANATION_COMMAND,
          title: "Ver explicación",
          arguments: [ruleId],
        };
        explanations.push(action);
      }
    }
    return [...fixes, ...explanations];
  }
}
