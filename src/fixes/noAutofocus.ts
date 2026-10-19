import { getAttr } from "./ast";
import type { Target } from "./ast";
import type { FixSuggestion } from "./types";

export function noAutofocusFixes({ opening, attr }: Target, text: string): FixSuggestion[] {
  const autoFocus = attr ?? getAttr(opening, "autoFocus");
  if (!autoFocus) return [];
  // Incluye el espacio previo para no dejar huecos ni líneas en blanco.
  let start = autoFocus.range[0];
  while (start > 0 && /\s/.test(text.charAt(start - 1))) start--;
  return [
    {
      title: "Quitar autoFocus",
      preferred: true,
      edits: [{ start, end: autoFocus.range[1], newText: "" }],
    },
  ];
}
