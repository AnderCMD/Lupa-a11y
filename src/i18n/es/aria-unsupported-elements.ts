import type { RuleExplanation } from "../types";

export const ariaUnsupportedElements: RuleExplanation = {
  ruleId: "jsx-a11y/aria-unsupported-elements",
  titulo: "ARIA en un elemento que no la admite",
  mensaje: "Este elemento no admite role ni atributos aria-*: quítalos.",
  porQueImporta:
    "Algunos elementos (como <meta>, <script> o <style>) no se muestran ni se leen, así que ARIA no hace nada en ellos. Dejarlo solo indica que se esperaba un efecto que no existe.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<meta charSet="utf-8" aria-hidden="true" />`,
  bienEjemplo: `<meta charSet="utf-8" />`,
  notaExtra:
    "Si querías ocultar contenido visible a los lectores de pantalla, aplica aria-hidden a un elemento que sí se renderiza.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-unsupported-elements.md",
};
