/**
 * Punto de entrada de la librería `lupa-a11y-core`: todo lo que no depende de VS Code
 * (motor, traducciones, quick fixes y la CLI `lupa-a11y`).
 */
export * from "./i18n";
export { PENDING_RULES } from "./i18n/pending";
export { runEslint, toLintMessages, virtualFilename } from "./linter/runEslint";
export type { LintMessage } from "./linter/runEslint";
export { mapMessages, CRITICAL_RULES, isCritical } from "./linter/mapDiagnostics";
export type { MappedDiagnostic } from "./linter/mapDiagnostics";
export { lintDocument, clearResultCache } from "./linter/engine";
export { flavorFor, isA11yRule, SUPPORTED_EXTENSIONS, SUPPORTED_LANGUAGES } from "./linter/flavors";
export type { Flavor } from "./linter/flavors";
export { maskTemplate } from "./linter/templates";
export { runCli } from "./cli";
export type { CliIO } from "./cli";
export type { EngineRequest, EngineResult } from "./linter/engine";
export { getFixes, applyEdits } from "./fixes";
export type { FixEdit, FixSuggestion } from "./fixes";
