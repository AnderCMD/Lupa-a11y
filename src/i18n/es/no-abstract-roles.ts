import type { RuleExplanation } from "../types";

export const noAbstractRoles: RuleExplanation = {
  ruleId: "@html-eslint/no-abstract-roles",
  titulo: "Role ARIA abstracto",
  mensaje: "Este role es abstracto (solo para la especificación): usa uno concreto.",
  porQueImporta:
    'Roles como "widget", "command" o "landmark" existen solo para organizar la especificación de ARIA. Los navegadores no los exponen y el elemento queda sin significado.',
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<div role="widget">Menú</div>`,
  bienEjemplo: `<nav aria-label="Principal">Menú</nav>`,
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl: "https://html-eslint.org/docs/rules/no-abstract-roles",
};
