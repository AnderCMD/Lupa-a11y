import type { RuleExplanation } from "../types";

export const ariaActivedescendantHasTabindex: RuleExplanation = {
  ruleId: "jsx-a11y/aria-activedescendant-has-tabindex",
  titulo: "aria-activedescendant sin tabIndex",
  mensaje: "Un elemento con aria-activedescendant debe poder recibir foco: agrega tabIndex.",
  porQueImporta:
    "aria-activedescendant indica qué opción está activa dentro de una lista o menú, pero solo funciona si el contenedor tiene el foco. Sin tabIndex, el teclado nunca llega a él.",
  afectados: ["Quien navega solo con teclado", "Personas que usan lector de pantalla"],
  malEjemplo: `<div role="listbox" aria-activedescendant={opcionActiva}>{opciones}</div>`,
  bienEjemplo: `<div role="listbox" tabIndex={0} aria-activedescendant={opcionActiva}>{opciones}</div>`,
  notaExtra: "Los elementos nativos que ya reciben foco (como <input>) no necesitan tabIndex.",
  wcag: {
    criterio: "2.1.1 Teclado",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-activedescendant-has-tabindex.md",
};
