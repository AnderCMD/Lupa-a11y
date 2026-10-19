import type { RuleExplanation } from "../types";

export const imgRedundantAlt: RuleExplanation = {
  ruleId: "jsx-a11y/img-redundant-alt",
  titulo: "Texto alternativo redundante",
  mensaje:
    'No hace falta decir "imagen" o "foto" en el alt: el lector ya anuncia que es una imagen.',
  porQueImporta:
    'El lector de pantalla ya dice "imagen" antes de leer el alt. Si tú también lo escribes, la persona oye "imagen, imagen de un gato" en cada foto.',
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<img src="/gato.jpg" alt="Imagen de un gato durmiendo" />`,
  bienEjemplo: `<img src="/gato.jpg" alt="Un gato durmiendo sobre un sofá" />`,
  notaExtra:
    'Es una buena práctica, no un fallo grave. Si el tipo de imagen importa (por ejemplo, "Fotografía de archivo de 1950"), puedes mencionarlo.',
  wcag: {
    criterio: "1.1.1 Contenido no textual",
    nivel: "buena práctica",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/img-redundant-alt.md",
};
