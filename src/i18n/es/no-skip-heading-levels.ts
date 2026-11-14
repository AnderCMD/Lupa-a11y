import type { RuleExplanation } from "../types";

export const noSkipHeadingLevels: RuleExplanation = {
  ruleId: "@html-eslint/no-skip-heading-levels",
  titulo: "Salto en los niveles de encabezado",
  mensaje: "Los encabezados no deben saltar niveles (por ejemplo, de <h1> a <h3>).",
  porQueImporta:
    "Muchas personas con lector de pantalla recorren la página saltando de encabezado en encabezado, como un índice. Un salto de nivel hace pensar que falta una sección.",
  afectados: [
    "Personas que usan lector de pantalla",
    "Personas con discapacidad cognitiva (la estructura ayuda a orientarse)",
  ],
  malEjemplo: `<h1>Tienda</h1>
<h3>Ofertas</h3>`,
  bienEjemplo: `<h1>Tienda</h1>
<h2>Ofertas</h2>`,
  notaExtra:
    "Elige el nivel por la estructura, no por el tamaño de letra: si quieres un <h2> más pequeño, cámbialo con CSS.",
  wcag: {
    criterio: "1.3.1 Información y relaciones",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  },
  docsUrl: "https://html-eslint.org/docs/rules/no-skip-heading-levels",
};
