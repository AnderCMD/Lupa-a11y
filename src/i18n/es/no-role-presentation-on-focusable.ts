import type { RuleExplanation } from "../types";

export const noRolePresentationOnFocusable: RuleExplanation = {
  ruleId: "vuejs-accessibility/no-role-presentation-on-focusable",
  titulo: 'role="presentation" en un elemento enfocable',
  mensaje: 'Un elemento que recibe el foco no puede tener role="presentation" ni "none".',
  porQueImporta:
    "Ese role le quita el significado al elemento, pero el teclado sigue llegando a él. La persona aterriza en algo que el lector de pantalla no sabe anunciar: un foco «fantasma».",
  afectados: ["Personas que usan lector de pantalla", "Personas que navegan con teclado"],
  malEjemplo: `<button role="presentation">Cerrar</button>`,
  bienEjemplo: `<button type="button">Cerrar</button>`,
  notaExtra:
    'Si el elemento de verdad es decorativo, quítalo del orden de tabulación (sin tabindex o con tabindex="-1") antes de usar role="presentation".',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/rules/no-role-presentation-on-focusable.html",
};
