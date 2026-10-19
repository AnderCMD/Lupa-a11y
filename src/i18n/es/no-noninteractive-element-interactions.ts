import type { RuleExplanation } from "../types";

export const noNoninteractiveElementInteractions: RuleExplanation = {
  ruleId: "jsx-a11y/no-noninteractive-element-interactions",
  titulo: "Evento en un elemento que no es interactivo",
  mensaje: "Este elemento (por ejemplo <li>) no es interactivo: usa un <button> dentro de él.",
  porQueImporta:
    "Elementos como <li>, <p> o <h2> son texto o estructura. Si reaccionan al clic, el lector de pantalla no avisa de que se puede activar y quien usa teclado no llega a ellos.",
  afectados: ["Quien navega solo con teclado", "Personas que usan lector de pantalla"],
  malEjemplo: `<li onClick={seleccionar}>Opción 1</li>`,
  bienEjemplo: `<li>
  <button type="button" onClick={seleccionar}>Opción 1</button>
</li>`,
  notaExtra:
    "Pon el elemento interactivo dentro del contenedor, en lugar de convertir el contenedor en interactivo.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-interactions.md",
};
