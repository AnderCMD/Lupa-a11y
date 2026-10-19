import type { RuleExplanation } from "../types";

export const iframeHasTitle: RuleExplanation = {
  ruleId: "jsx-a11y/iframe-has-title",
  titulo: "iframe sin título",
  mensaje: "Este <iframe> necesita un atributo title que describa su contenido.",
  porQueImporta:
    'Un iframe es una página dentro de otra. El lector de pantalla anuncia su título para que la persona decida si entrar; sin título, solo oye "marco" y debe explorarlo para saber qué contiene.',
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<iframe src="https://maps.example.com/oficina" />`,
  bienEjemplo: `<iframe src="https://maps.example.com/oficina" title="Mapa de la ubicación de la oficina" />`,
  notaExtra:
    'El título debe describir el contenido ("Mapa de la oficina"), no repetir la palabra "iframe".',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/iframe-has-title.md",
};
