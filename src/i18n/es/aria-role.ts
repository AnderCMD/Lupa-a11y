import type { RuleExplanation } from "../types";

export const ariaRole: RuleExplanation = {
  ruleId: "jsx-a11y/aria-role",
  titulo: "Role ARIA inválido",
  mensaje: "Este role no existe en ARIA: usa un role válido o, mejor, el elemento HTML correcto.",
  porQueImporta:
    "El atributo role le dice al lector de pantalla qué es el elemento (botón, lista, menú…). Si el valor no existe, se ignora y el elemento se anuncia como algo genérico.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<div role="boton">Enviar</div>`,
  bienEjemplo: `<button type="button">Enviar</button>`,
  notaExtra:
    'Los roles de ARIA están en inglés (button, dialog, navigation). Un error común es traducirlos: role="boton" no funciona.',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-role.md",
};
