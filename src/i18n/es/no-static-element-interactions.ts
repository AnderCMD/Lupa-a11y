import type { RuleExplanation } from "../types";

export const noStaticElementInteractions: RuleExplanation = {
  ruleId: "jsx-a11y/no-static-element-interactions",
  titulo: "Elemento no interactivo con eventos",
  mensaje: "Un <div> o <span> con eventos no dice qué es: usa <button> o agrega un role.",
  porQueImporta:
    "Un <div> no le dice a las tecnologías de apoyo que se puede pulsar, así que el lector de pantalla lo trata como texto suelto. Quien no usa mouse tampoco puede llegar a él con Tab.",
  afectados: ["Personas que usan lector de pantalla", "Quien navega solo con teclado"],
  malEjemplo: `<div onClick={guardar}>Guardar</div>`,
  bienEjemplo: `<button type="button" onClick={guardar}>Guardar</button>`,
  notaExtra:
    'Si no puedes cambiar el elemento, agrega un role adecuado (role="button"), tabIndex={0} y manejo de Enter y Espacio. Cambiar el elemento casi siempre es más simple y más robusto.',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md",
};
