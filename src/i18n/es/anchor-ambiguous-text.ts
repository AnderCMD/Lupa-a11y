import type { RuleExplanation } from "../types";

export const anchorAmbiguousText: RuleExplanation = {
  ruleId: "jsx-a11y/anchor-ambiguous-text",
  titulo: "Texto de enlace ambiguo",
  mensaje: 'El texto de este enlace no dice a dónde lleva: evita "aquí" o "haz clic aquí".',
  porQueImporta:
    'Quien usa lector de pantalla suele recorrer la lista de enlaces de la página, sin el texto que los rodea. Una lista de "aquí, aquí, leer más" no le dice nada.',
  afectados: [
    "Personas que usan lector de pantalla",
    "Quien usa control por voz",
    "Quien recorre los enlaces rápidamente",
  ],
  malEjemplo: `<a href="/guia-de-estilo">Haz clic aquí</a>`,
  bienEjemplo: `<a href="/guia-de-estilo">Lee la guía de estilo</a>`,
  notaExtra:
    'El texto debe tener sentido por sí solo. Si el diseño exige un "Leer más", agrega el contexto con aria-label (por ejemplo, "Leer más sobre la guía de estilo").',
  wcag: {
    criterio: "2.4.4 Propósito de los enlaces (en contexto)",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-ambiguous-text.md",
};
