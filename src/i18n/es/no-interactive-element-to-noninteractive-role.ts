import type { RuleExplanation } from "../types";

export const noInteractiveElementToNoninteractiveRole: RuleExplanation = {
  ruleId: "jsx-a11y/no-interactive-element-to-noninteractive-role",
  titulo: "Elemento interactivo con role no interactivo",
  mensaje: "No le quites su función a un elemento interactivo con un role como presentation.",
  porQueImporta:
    'Un <button> o un enlace ya le dicen al lector de pantalla que se pueden activar. Si les pones un role que los "desactiva", esa información se pierde aunque el elemento siga funcionando.',
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<button type="button" role="presentation">Guardar</button>`,
  bienEjemplo: `<button type="button">Guardar</button>`,
  notaExtra:
    "Si necesitas otro elemento, usa la etiqueta HTML adecuada en vez de cambiarle el role.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-interactive-element-to-noninteractive-role.md",
};
