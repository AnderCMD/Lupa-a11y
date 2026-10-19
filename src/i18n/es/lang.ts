import type { RuleExplanation } from "../types";

export const lang: RuleExplanation = {
  ruleId: "jsx-a11y/lang",
  titulo: "Código de idioma inválido",
  mensaje: "El valor de lang no es un código de idioma válido (por ejemplo, es o es-MX).",
  porQueImporta:
    'El lector de pantalla elige la voz y la pronunciación según lang. Con un código inválido (como "espanol") usa el idioma por defecto del sistema y lee mal el texto.',
  afectados: ["Personas que usan lector de pantalla", "Quien usa traducción automática"],
  malEjemplo: `<html lang="espanol"><body /></html>`,
  bienEjemplo: `<html lang="es"><body /></html>`,
  notaExtra:
    "Usa el código de dos letras del idioma (es, en, pt), con región opcional (es-MX, es-AR).",
  wcag: {
    criterio: "3.1.1 Idioma de la página",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
  },
  docsUrl: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/lang.md",
};
