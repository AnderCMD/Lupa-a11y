import type { RuleExplanation } from "../types";

export const noNoninteractiveTabindex: RuleExplanation = {
  ruleId: "jsx-a11y/no-noninteractive-tabindex",
  titulo: "tabIndex en un elemento no interactivo",
  mensaje: "No agregues tabIndex a elementos que no se pueden usar (texto, contenedores).",
  porQueImporta:
    "Si Tab se detiene en un texto que no hace nada, quien navega con teclado pierde tiempo y no entiende qué se espera de él.",
  afectados: ["Quien navega solo con teclado", "Personas que usan lector de pantalla"],
  malEjemplo: `<div tabIndex={0}>Texto informativo</div>`,
  bienEjemplo: `<div>Texto informativo</div>`,
  notaExtra:
    "Hay excepciones razonables, como un área con scroll que debe poder desplazarse con teclado: en ese caso usa tabIndex={0} junto con un role y un nombre accesible.",
  wcag: {
    criterio: "2.4.3 Orden del foco",
    nivel: "buena práctica",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-tabindex.md",
};
