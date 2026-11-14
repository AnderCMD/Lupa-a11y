import type { RuleExplanation } from "../types";

export const noNonScalableViewport: RuleExplanation = {
  ruleId: "@html-eslint/no-non-scalable-viewport",
  titulo: "Zoom bloqueado en el móvil",
  mensaje: "No bloquees el zoom: quita user-scalable=no (y maximum-scale=1) del viewport.",
  porQueImporta:
    "Bloquear el zoom impide ampliar el texto con los dedos. Para muchas personas con baja visión es la única forma de leer la página en el móvil.",
  afectados: ["Personas con baja visión", "Personas mayores", "Cualquiera en una pantalla pequeña"],
  malEjemplo: `<meta name="viewport" content="width=device-width, user-scalable=no" />`,
  bienEjemplo: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
  wcag: {
    criterio: "1.4.4 Cambio de tamaño del texto",
    nivel: "AA",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
  },
  docsUrl: "https://html-eslint.org/docs/rules/no-non-scalable-viewport",
};
