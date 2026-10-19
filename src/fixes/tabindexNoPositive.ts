import { asNode, getAttr } from "./ast";
import type { Target } from "./ast";
import type { FixSuggestion } from "./types";

export function tabindexNoPositiveFixes({ opening, attr }: Target): FixSuggestion[] {
  const tabIndex = attr ?? getAttr(opening, "tabIndex");
  const value = asNode(tabIndex?.value);
  if (!value) return [];
  return [
    {
      title: "Reemplazar por tabIndex={0}",
      preferred: true,
      edits: [{ start: value.range[0], end: value.range[1], newText: "{0}" }],
    },
  ];
}
