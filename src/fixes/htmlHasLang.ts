import { attrInsertOffset, elementName, getAttr, hasSpread } from "./ast";
import type { Target } from "./ast";
import type { FixSuggestion } from "./types";

/** Añade lang="es"; la persona puede cambiarlo por el idioma real de la página. */
export function htmlHasLangFixes({ opening, attr }: Target): FixSuggestion[] {
  if (attr || elementName(opening) !== "html" || hasSpread(opening)) return [];
  if (getAttr(opening, "lang")) return [];
  const at = attrInsertOffset(opening);
  return [
    {
      title: 'Agregar lang="es" a <html>',
      edits: [{ start: at, end: at, newText: ' lang="es"' }],
    },
  ];
}
