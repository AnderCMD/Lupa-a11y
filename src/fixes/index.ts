import { findTarget, parseJsx } from "./ast";
import { altTextFixes } from "./altText";
import { clickEventsFixes } from "./clickEvents";
import { htmlHasLangFixes } from "./htmlHasLang";
import { imgRedundantAltFixes } from "./imgRedundantAlt";
import { noAutofocusFixes } from "./noAutofocus";
import { tabindexNoPositiveFixes } from "./tabindexNoPositive";
import type { FixEdit, FixSuggestion } from "./types";

export type { FixEdit, FixSuggestion } from "./types";

/**
 * Quick fixes seguros para el diagnóstico de `ruleId` que empieza en `offset`.
 * Regla de oro: nunca inventar contenido que requiere criterio humano.
 */
export function getFixes(ruleId: string, text: string, offset: number): FixSuggestion[] {
  const root = parseJsx(text);
  const target = root && findTarget(root, offset);
  if (!target) return [];
  switch (ruleId) {
    case "jsx-a11y/alt-text":
      return altTextFixes(target);
    case "jsx-a11y/click-events-have-key-events":
    case "jsx-a11y/no-static-element-interactions":
      return clickEventsFixes(target);
    case "jsx-a11y/html-has-lang":
      return htmlHasLangFixes(target);
    case "jsx-a11y/img-redundant-alt":
      return imgRedundantAltFixes(target, text);
    case "jsx-a11y/tabindex-no-positive":
      return tabindexNoPositiveFixes(target);
    case "jsx-a11y/no-autofocus":
      return noAutofocusFixes(target, text);
    default:
      return [];
  }
}

export function applyEdits(text: string, edits: readonly FixEdit[]): string {
  return [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce((acc, e) => acc.slice(0, e.start) + e.newText + acc.slice(e.end), text);
}
