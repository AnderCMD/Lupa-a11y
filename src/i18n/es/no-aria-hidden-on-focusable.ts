import type { RuleExplanation } from "../types";

export const noAriaHiddenOnFocusable: RuleExplanation = {
  ruleId: "jsx-a11y/no-aria-hidden-on-focusable",
  titulo: "Elemento enfocable oculto con aria-hidden",
  mensaje: 'No pongas aria-hidden="true" en algo que recibe foco con Tab.',
  porQueImporta:
    'aria-hidden oculta el elemento a los lectores de pantalla, pero el teclado sigue llegando a él. La persona se queda con el foco en algo que "no existe" y no sabe dónde está.',
  afectados: ["Personas que usan lector de pantalla", "Quien navega solo con teclado"],
  malEjemplo: `<button type="button" aria-hidden="true">Cerrar</button>`,
  bienEjemplo: `<button type="button">Cerrar</button>`,
  notaExtra:
    "Si de verdad quieres ocultarlo, quítalo también del orden de foco (tabIndex={-1}, disabled o hidden). Lo habitual es simplemente quitar aria-hidden.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-aria-hidden-on-focusable.md",
};
