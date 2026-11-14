import type { RuleExplanation } from "../types";

export const noHeadingInsideButton: RuleExplanation = {
  ruleId: "@html-eslint/no-heading-inside-button",
  titulo: "Encabezado dentro de un botón",
  mensaje: "Un botón no puede contener encabezados (<h1>…<h6>).",
  porQueImporta:
    "Dentro de un botón, el encabezado pierde su significado y desaparece del índice de encabezados que usan los lectores de pantalla. Además, no es HTML válido.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<button><h2>Preguntas frecuentes</h2></button>`,
  bienEjemplo: `<h2><button type="button" aria-expanded="false">Preguntas frecuentes</button></h2>`,
  notaExtra: "En un acordeón, el patrón correcto es el inverso: el botón va dentro del encabezado.",
  wcag: {
    criterio: "1.3.1 Información y relaciones",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  },
  docsUrl: "https://html-eslint.org/docs/rules/no-heading-inside-button",
};
