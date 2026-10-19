import type { RuleExplanation } from "../types";

export const autocompleteValid: RuleExplanation = {
  ruleId: "jsx-a11y/autocomplete-valid",
  titulo: "Valor de autoComplete no válido",
  mensaje: "Este valor de autoComplete no existe: usa uno oficial (por ejemplo, name o email).",
  porQueImporta:
    "El navegador usa autoComplete para rellenar campos por ti y ayuda a personas con discapacidad cognitiva o motriz a escribir menos. Si el valor es inventado, la ayuda no llega.",
  afectados: [
    "Personas con discapacidad motriz o cognitiva",
    "Quien usa gestor de contraseñas o autocompletado",
  ],
  malEjemplo: `<input type="text" name="nombre" autoComplete="nombre" />`,
  bienEjemplo: `<input type="text" name="nombre" autoComplete="name" />`,
  notaExtra:
    "Los valores están en inglés (name, email, tel, street-address, postal-code…). Hay una lista completa en la especificación de HTML.",
  wcag: {
    criterio: "1.3.5 Identificar el propósito de la entrada",
    nivel: "AA",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/autocomplete-valid.md",
};
