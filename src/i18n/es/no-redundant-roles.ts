import type { RuleExplanation } from "../types";

export const noRedundantRoles: RuleExplanation = {
  ruleId: "jsx-a11y/no-redundant-roles",
  titulo: "Role redundante",
  mensaje: "Este role ya es el que tiene el elemento por defecto: puedes quitarlo.",
  porQueImporta:
    'Un <button> ya es un botón para los lectores de pantalla. Repetir role="button" no aporta nada y complica el código; con el tiempo puede quedar desactualizado.',
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<button type="button" role="button">Guardar</button>`,
  bienEjemplo: `<button type="button">Guardar</button>`,
  notaExtra: "Es una buena práctica, no un fallo grave.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "buena práctica",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-redundant-roles.md",
};
