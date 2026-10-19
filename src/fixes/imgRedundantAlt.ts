import { asNode, getAttr } from "./ast";
import type { Target } from "./ast";
import type { FixSuggestion } from "./types";

const LEADING_REDUNDANT =
  /^\s*(?:imagen|foto|fotografía|fotografia|image|photo|picture)\s+(?:del?|con|en|of)?\s*/i;

/** Quita solo la frase redundante inicial ("Imagen de…"); el resto no se toca. */
export function stripRedundantLead(alt: string): string | undefined {
  const rest = alt.replace(LEADING_REDUNDANT, "").trim();
  if (!rest || rest === alt.trim()) return undefined;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

export function imgRedundantAltFixes({ opening, attr }: Target, text: string): FixSuggestion[] {
  if (attr) return [];
  const alt = getAttr(opening, "alt");
  const value = asNode(alt?.value);
  if (value?.type !== "Literal" || typeof value.value !== "string") return [];
  const cleaned = stripRedundantLead(value.value);
  if (!cleaned) return [];
  const quote = text.charAt(value.range[0]);
  if ((quote !== '"' && quote !== "'") || cleaned.includes(quote)) return [];
  return [
    {
      title: `Cambiar alt a "${cleaned}"`,
      preferred: true,
      edits: [
        {
          start: value.range[0],
          end: value.range[1],
          newText: `${quote}${cleaned}${quote}`,
        },
      ],
    },
  ];
}
