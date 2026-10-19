import type { RuleExplanation } from "../types";

export const noAccessKey: RuleExplanation = {
  ruleId: "jsx-a11y/no-access-key",
  titulo: "accessKey en un elemento",
  mensaje: "Evita accessKey: choca con los atajos del navegador y de los lectores de pantalla.",
  porQueImporta:
    "Los atajos que define accessKey se mezclan con los del navegador y los de las tecnologías de apoyo, y pueden activar acciones sin que la persona lo espere. Además, cada sistema los activa con teclas distintas.",
  afectados: [
    "Personas que usan lector de pantalla",
    "Quien navega solo con teclado",
    "Usuarios de control por voz",
  ],
  malEjemplo: `<button type="button" accessKey="g">Guardar</button>`,
  bienEjemplo: `<button type="button">Guardar</button>`,
  notaExtra:
    "Si necesitas atajos, ofrécelos como opción configurable y documentada, y permite desactivarlos.",
  wcag: {
    criterio: "2.1.4 Atajos con teclado de caracteres",
    nivel: "buena práctica",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-access-key.md",
};
