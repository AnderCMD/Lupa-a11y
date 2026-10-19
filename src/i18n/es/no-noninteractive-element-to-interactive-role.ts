import type { RuleExplanation } from "../types";

export const noNoninteractiveElementToInteractiveRole: RuleExplanation = {
  ruleId: "jsx-a11y/no-noninteractive-element-to-interactive-role",
  titulo: "Elemento no interactivo con role interactivo",
  mensaje: "No conviertas un elemento de estructura (<h2>, <li>…) en interactivo con un role.",
  porQueImporta:
    'Un encabezado o una lista tienen un significado propio que ayuda a orientarse. Si les cambias el role a "button", se pierde ese significado y además necesitas agregar tú el teclado.',
  afectados: ["Personas que usan lector de pantalla", "Quien navega solo con teclado"],
  malEjemplo: `<h2 role="button">Detalles</h2>`,
  bienEjemplo: `<h2>
  <button type="button">Detalles</button>
</h2>`,
  notaExtra:
    "Conserva el elemento semántico y pon dentro el elemento interactivo (por ejemplo, un <button> dentro del <h2> en un acordeón).",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-to-interactive-role.md",
};
