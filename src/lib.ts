/**
 * Punto de entrada de la librería `lupa-a11y-core`: todo lo que no depende de VS Code.
 */
export * from "./i18n";
export { PENDING_RULES } from "./i18n/pending";
export { runEslint, toLintMessages, virtualFilename } from "./linter/runEslint";
export type { LintMessage } from "./linter/runEslint";
export { mapMessages, CRITICAL_RULES } from "./linter/mapDiagnostics";
export type { MappedDiagnostic } from "./linter/mapDiagnostics";
export { lintDocument } from "./linter/engine";
export type { EngineRequest, EngineResult } from "./linter/engine";
export { getFixes, applyEdits } from "./fixes";
export type { FixEdit, FixSuggestion } from "./fixes";
