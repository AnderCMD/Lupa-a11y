import { canonicalRuleId, docsUrlFor, getExplanation } from "../i18n";
import type { LintMessage } from "./runEslint";

/** Diagnóstico independiente de `vscode` (posiciones base 0). */
export interface MappedDiagnostic {
  startLine: number;
  startCharacter: number;
  endLine: number;
  endCharacter: number;
  message: string;
  ruleId: string;
  /** Regla equivalente cuya explicación se usa (igual a `ruleId` si no es un alias). */
  canonicalRuleId: string;
  docsUrl: string;
  translated: boolean;
}

/** Reglas que, si el usuario lo activa, se muestran como Error. */
export const CRITICAL_RULES: readonly string[] = [
  "jsx-a11y/alt-text",
  "jsx-a11y/aria-role",
  "jsx-a11y/aria-props",
];

export function isCritical(ruleId: string): boolean {
  return CRITICAL_RULES.includes(canonicalRuleId(ruleId));
}

/**
 * ESLint usa líneas y columnas base 1; VS Code usa base 0. `ignoreRules` acepta
 * tanto el id real (`vuejs-accessibility/alt-text`) como el equivalente
 * (`jsx-a11y/alt-text`, que ignora la regla en todos los frameworks).
 */
export function mapMessages(
  messages: readonly LintMessage[],
  ignoreRules: readonly string[] = [],
): MappedDiagnostic[] {
  const ignored = new Set(ignoreRules);
  const out: MappedDiagnostic[] = [];
  for (const m of messages) {
    const canonical = canonicalRuleId(m.ruleId);
    if (ignored.has(m.ruleId) || ignored.has(canonical)) continue;
    const explanation = getExplanation(m.ruleId);
    const startLine = m.line - 1;
    const startCharacter = m.column - 1;
    out.push({
      startLine,
      startCharacter,
      endLine: m.endLine !== undefined ? m.endLine - 1 : startLine,
      endCharacter: m.endColumn !== undefined ? m.endColumn - 1 : startCharacter + 1,
      message: explanation ? explanation.mensaje : `${m.message} (sin traducir)`,
      ruleId: m.ruleId,
      canonicalRuleId: canonical,
      docsUrl:
        canonical === m.ruleId && explanation?.docsUrl ? explanation.docsUrl : docsUrlFor(m.ruleId),
      translated: explanation !== undefined,
    });
  }
  return out;
}
