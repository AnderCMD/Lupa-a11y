import type { RuleExplanation } from "../types";

export const headingHasContent: RuleExplanation = {
  ruleId: "jsx-a11y/heading-has-content",
  titulo: "Encabezado vacío",
  mensaje: "Este encabezado (<h1> a <h6>) no tiene texto: agrega contenido o elimínalo.",
  porQueImporta:
    "Quien usa lector de pantalla salta entre encabezados para entender la página. Uno vacío es una parada que no dice nada y confunde la estructura.",
  afectados: ["Personas que usan lector de pantalla", "Quien navega la página por sus encabezados"],
  malEjemplo: `<h2></h2>`,
  bienEjemplo: `<h2>Resumen del pedido</h2>`,
  notaExtra:
    'No uses encabezados solo para dar tamaño al texto (para eso está CSS), ni dejes uno vacío para "reservar espacio".',
  wcag: {
    criterio: "2.4.6 Encabezados y etiquetas",
    nivel: "AA",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/heading-has-content.md",
};
