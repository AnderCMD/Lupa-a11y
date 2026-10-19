import type { RuleExplanation } from "../types";

export const anchorIsValid: RuleExplanation = {
  ruleId: "jsx-a11y/anchor-is-valid",
  titulo: "Enlace sin destino válido",
  mensaje:
    "Este enlace no lleva a ningún lado: usa un href real o un <button> si ejecuta una acción.",
  porQueImporta:
    'Los lectores de pantalla anuncian un enlace como una navegación a otra página; si en realidad ejecuta una acción, la persona espera algo que no ocurre. Además, href="#" salta al inicio de la página y ensucia el historial.',
  afectados: [
    "Personas que usan lector de pantalla",
    "Quien navega solo con teclado",
    "Cualquiera que quiera abrir el enlace en otra pestaña",
  ],
  malEjemplo: `<a href="#" onClick={abrirDetalles}>Ver detalles</a>`,
  bienEjemplo: `<button type="button" onClick={abrirDetalles}>Ver detalles</button>`,
  notaExtra:
    'Un <button> es para acciones; un <a> es para ir a un lugar. Si navega a otra página, usa <a href="/detalles"> con una URL real.',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md",
};
