import { attrInsertOffset, elementName, getAttr, hasSpread } from "./ast";
import type { Target } from "./ast";
import type { FixSuggestion } from "./types";

/**
 * Nunca se genera una descripción: solo se marca como decorativa (alt="")
 * o se deja un TODO claramente visible para que la persona lo complete.
 */
export function altTextFixes({ opening, attr }: Target): FixSuggestion[] {
  if (attr) return [];
  if (elementName(opening) !== "img" || hasSpread(opening)) return [];
  if (getAttr(opening, "alt")) return [];
  const at = attrInsertOffset(opening);
  const insert = (newText: string) => [{ start: at, end: at, newText }];
  return [
    {
      title: 'Marcar la imagen como decorativa (alt="")',
      edits: insert(' alt=""'),
    },
    {
      title: 'Agregar alt="TODO: describe lo que muestra"',
      edits: insert(' alt="TODO: describe lo que muestra"'),
    },
  ];
}
