import type { RuleExplanation } from "../types";

export const tabindexNoPositive: RuleExplanation = {
  ruleId: "jsx-a11y/tabindex-no-positive",
  titulo: "tabIndex positivo",
  mensaje: "Evita tabIndex mayor que 0: altera el orden natural de Tab. Usa 0 o -1.",
  porQueImporta:
    "Un tabIndex positivo hace que el foco salte a ese elemento antes que a los demás, sin importar dónde esté en la página. El recorrido con teclado se vuelve impredecible.",
  afectados: ["Quien navega solo con teclado", "Personas que usan lector de pantalla"],
  malEjemplo: `<button type="button" tabIndex={3}>Siguiente</button>`,
  bienEjemplo: `<button type="button" tabIndex={0}>Siguiente</button>`,
  notaExtra:
    "Para cambiar el orden, reordena el HTML. Un <button> ya es enfocable, así que aquí incluso puedes quitar tabIndex. Usa -1 solo para elementos que reciben foco por código y no por Tab.",
  wcag: {
    criterio: "2.4.3 Orden del foco",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/tabindex-no-positive.md",
};
