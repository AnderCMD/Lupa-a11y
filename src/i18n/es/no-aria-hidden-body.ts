import type { RuleExplanation } from "../types";

export const noAriaHiddenBody: RuleExplanation = {
  ruleId: "@html-eslint/no-aria-hidden-body",
  titulo: "aria-hidden en <body>",
  mensaje: 'No pongas aria-hidden="true" en <body>: oculta toda la página.',
  porQueImporta:
    "aria-hidden en <body> esconde todo el contenido a las tecnologías de apoyo. Para un lector de pantalla, la página queda en blanco.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<body aria-hidden="true">…</body>`,
  bienEjemplo: `<body>…</body>`,
  notaExtra:
    "Si quieres ocultar el fondo mientras hay un diálogo abierto, usa <dialog> con showModal() o el atributo inert en el contenedor principal, no en <body>.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl: "https://html-eslint.org/docs/rules/no-aria-hidden-body",
};
