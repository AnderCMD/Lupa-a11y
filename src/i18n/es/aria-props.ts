import type { RuleExplanation } from "../types";

export const ariaProps: RuleExplanation = {
  ruleId: "jsx-a11y/aria-props",
  titulo: "Atributo ARIA que no existe",
  mensaje: "Este atributo aria-* no es válido: revisa si tiene un error de escritura.",
  porQueImporta:
    "ARIA es un conjunto de atributos que añaden información para los lectores de pantalla (nombres, estados, relaciones). Si escribes uno mal, el navegador lo ignora y esa información nunca llega a la persona.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<button aria-lable="Cerrar">×</button>`,
  bienEjemplo: `<button aria-label="Cerrar">×</button>`,
  notaExtra:
    "Antes de usar ARIA, comprueba si un elemento HTML ya hace lo que necesitas: la primera regla de ARIA es no usarlo cuando HTML basta.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-props.md",
};
