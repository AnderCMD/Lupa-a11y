import type { RuleExplanation } from "../types";

export const roleSupportsAriaProps: RuleExplanation = {
  ruleId: "jsx-a11y/role-supports-aria-props",
  titulo: "Atributo ARIA no compatible con el role",
  mensaje: "Este role no admite ese atributo aria-*: cámbialo o usa uno compatible.",
  porQueImporta:
    "Cada role solo reconoce ciertos atributos ARIA. Si usas uno que no corresponde, el lector de pantalla lo ignora o lo anuncia mal, y la persona recibe un estado incorrecto.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<button type="button" aria-checked="true">Activar</button>`,
  bienEjemplo: `<button type="button" aria-pressed="true">Activar</button>`,
  notaExtra:
    "Un botón de dos estados usa aria-pressed; aria-checked es para checkbox, radio y switch. Consulta la tabla de atributos de cada role en la especificación de ARIA.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-supports-aria-props.md",
};
