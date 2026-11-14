import * as vscode from "vscode";
import { getFixes } from "../fixes";
import { getExplanation } from "../i18n";
import { flavorFor } from "../linter/flavors";
import { ruleIdOf } from "./hoverProvider";
import { SHOW_EXPLANATION_COMMAND } from "./render";

export const IGNORE_RULE_COMMAND = "lupaA11y.ignoreRule";

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
    const ignores: vscode.CodeAction[] = [];
    const seenFixes = new Set<string>();
    const seenRules = new Set<string>();
    const text = document.getText();
    const flavor = flavorFor(document.fileName, document.languageId);

    for (const d of context.diagnostics) {
      const ruleId = ruleIdOf(d);
      if (!ruleId) continue;

      for (const fix of getFixes(ruleId, text, document.offsetAt(d.range.start), flavor)) {
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

      if (seenRules.has(ruleId)) continue;
      seenRules.add(ruleId);
      if (getExplanation(ruleId)) {
        const action = new vscode.CodeAction("Ver explicación", vscode.CodeActionKind.QuickFix);
        action.diagnostics = [d];
        action.command = {
          command: SHOW_EXPLANATION_COMMAND,
          title: "Ver explicación",
          arguments: [ruleId],
        };
        explanations.push(action);
      }
      const ignore = new vscode.CodeAction(
        `Ignorar ${ruleId} en este workspace`,
        vscode.CodeActionKind.QuickFix,
      );
      ignore.diagnostics = [d];
      ignore.command = { command: IGNORE_RULE_COMMAND, title: ignore.title, arguments: [ruleId] };
      ignores.push(ignore);
    }
    return [...fixes, ...explanations, ...ignores];
  }
}
