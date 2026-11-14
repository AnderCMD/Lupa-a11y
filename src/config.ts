import * as vscode from "vscode";
import { SUPPORTED_LANGUAGES } from "./linter/flavors";

export interface LupaConfig {
  enable: boolean;
  severity: vscode.DiagnosticSeverity;
  criticalRulesAsError: boolean;
  ignoreRules: string[];
  lintOn: "type" | "save";
  useProjectEslintConfig: boolean;
  maxFileSizeKb: number;
  /** Idiomas de VS Code que se analizan. */
  languages: ReadonlySet<string>;
  /** Límite de archivos del comando "Analizar el workspace". */
  workspaceMaxFiles: number;
}

const SEVERITIES: Record<string, vscode.DiagnosticSeverity> = {
  error: vscode.DiagnosticSeverity.Error,
  warning: vscode.DiagnosticSeverity.Warning,
  information: vscode.DiagnosticSeverity.Information,
  hint: vscode.DiagnosticSeverity.Hint,
};

export function readConfig(scope?: vscode.Uri): LupaConfig {
  const c = vscode.workspace.getConfiguration("lupaA11y", scope);
  return {
    enable: c.get<boolean>("enable", true),
    severity: SEVERITIES[c.get<string>("severity", "warning")] ?? vscode.DiagnosticSeverity.Warning,
    criticalRulesAsError: c.get<boolean>("criticalRulesAsError", false),
    ignoreRules: c.get<string[]>("ignoreRules", []),
    lintOn: c.get<"type" | "save">("lintOn", "type"),
    useProjectEslintConfig: c.get<boolean>("useProjectEslintConfig", true),
    maxFileSizeKb: c.get<number>("maxFileSizeKb", 500),
    languages: new Set(c.get<string[]>("languages", [...SUPPORTED_LANGUAGES])),
    workspaceMaxFiles: c.get<number>("workspaceMaxFiles", 2000),
  };
}
