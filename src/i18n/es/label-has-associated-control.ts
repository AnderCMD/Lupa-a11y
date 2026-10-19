import type { RuleExplanation } from "../types";

export const labelHasAssociatedControl: RuleExplanation = {
  ruleId: "jsx-a11y/label-has-associated-control",
  titulo: "Etiqueta sin campo asociado",
  mensaje: "Este <label> debe estar ligado a su campo (con htmlFor o envolviéndolo).",
  porQueImporta:
    "Sin esa relación, el lector de pantalla no sabe qué texto describe el campo, y hacer clic en la etiqueta no enfoca el campo. Se vuelve más difícil de pulsar, sobre todo en el móvil.",
  afectados: [
    "Personas que usan lector de pantalla",
    "Personas con discapacidad motriz (la etiqueta amplía el área de clic)",
    "Quien usa control por voz",
  ],
  malEjemplo: `<label>Nombre</label>
<input type="text" name="nombre" />`,
  bienEjemplo: `<label htmlFor="nombre">Nombre</label>
<input id="nombre" type="text" name="nombre" />`,
  notaExtra:
    'También puedes envolver el campo dentro de la etiqueta: <label>Nombre <input type="text" /></label>. En React se escribe htmlFor, no for.',
  wcag: {
    criterio: "1.3.1 Información y relaciones",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md",
};
