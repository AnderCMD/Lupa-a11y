import type { RuleExplanation } from "../types";

export const htmlHasLang: RuleExplanation = {
  ruleId: "jsx-a11y/html-has-lang",
  titulo: "Página sin idioma",
  mensaje: 'La etiqueta <html> necesita el atributo lang (por ejemplo, lang="es").',
  porQueImporta:
    "El lector de pantalla elige la pronunciación según el idioma de la página. Sin él, un texto en español puede leerse con acento inglés y volverse difícil de entender.",
  afectados: ["Personas que usan lector de pantalla", "Quien usa traducción automática"],
  malEjemplo: `<html>
  <body>{children}</body>
</html>`,
  bienEjemplo: `<html lang="es">
  <body>{children}</body>
</html>`,
  notaExtra:
    'Indica el idioma principal de la página. Si una parte está en otro idioma, márcala con lang en ese elemento: <span lang="en">.',
  wcag: {
    criterio: "3.1.1 Idioma de la página",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/html-has-lang.md",
};
