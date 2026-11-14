import type { RuleExplanation } from "../types";

export const requireTitle: RuleExplanation = {
  ruleId: "@html-eslint/require-title",
  titulo: "Página sin <title>",
  mensaje: "La página necesita un <title> que diga de qué trata.",
  porQueImporta:
    "El título es lo primero que anuncia el lector de pantalla al abrir la página, y es el nombre de la pestaña. Sin él, cuesta saber dónde estás o distinguir pestañas.",
  afectados: [
    "Personas que usan lector de pantalla",
    "Personas con discapacidad cognitiva o de memoria",
    "Cualquiera con muchas pestañas abiertas",
  ],
  malEjemplo: `<head>
  <meta charset="utf-8" />
</head>`,
  bienEjemplo: `<head>
  <meta charset="utf-8" />
  <title>Carrito de compra · Mi tienda</title>
</head>`,
  wcag: {
    criterio: "2.4.2 Página titulada",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
  },
  docsUrl: "https://html-eslint.org/docs/rules/require-title",
};
