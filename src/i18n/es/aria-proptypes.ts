import type { RuleExplanation } from "../types";

export const ariaProptypes: RuleExplanation = {
  ruleId: "jsx-a11y/aria-proptypes",
  titulo: "Valor ARIA inválido",
  mensaje: "El valor de este atributo aria-* no es válido para ese tipo de atributo.",
  porQueImporta:
    "Cada atributo ARIA acepta ciertos valores (verdadero/falso, un número, un identificador…). Si el valor es otro, el lector de pantalla lo ignora o anuncia un estado equivocado.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<button type="button" aria-pressed="si">Favorito</button>`,
  bienEjemplo: `<button type="button" aria-pressed="true">Favorito</button>`,
  notaExtra:
    'Los valores de ARIA van en inglés y en minúsculas: "true", "false" o "mixed", no "sí" ni "no". En JSX puedes pasar un booleano: aria-pressed={activo}.',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-proptypes.md",
};
