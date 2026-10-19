import type { RuleExplanation } from "../types";

export const noAutofocus: RuleExplanation = {
  ruleId: "jsx-a11y/no-autofocus",
  titulo: "Foco automático",
  mensaje: "Evita autoFocus: mueve el foco sin que la persona lo espere.",
  porQueImporta:
    "Cuando la página mueve el foco por su cuenta, quien usa lector de pantalla pierde su lugar, y quien ve la pantalla puede saltarse contenido o abrir el teclado del móvil sin querer.",
  afectados: [
    "Personas que usan lector de pantalla",
    "Personas con baja visión o que usan ampliador de pantalla",
    "Quien navega solo con teclado",
  ],
  malEjemplo: `<input type="text" name="buscar" autoFocus />`,
  bienEjemplo: `<input type="text" name="buscar" />`,
  notaExtra:
    "Hay casos legítimos, como llevar el foco al primer campo de un diálogo modal. Hazlo desde el código, como respuesta a una acción de la persona, no al cargar la página.",
  wcag: {
    criterio: "2.4.3 Orden del foco",
    nivel: "buena práctica",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-autofocus.md",
};
