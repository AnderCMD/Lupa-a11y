import type { RuleExplanation } from "../types";

export const formControlHasLabel: RuleExplanation = {
  ruleId: "vuejs-accessibility/form-control-has-label",
  titulo: "Campo de formulario sin etiqueta",
  mensaje: "Este campo necesita una etiqueta (<label>, aria-label o aria-labelledby).",
  porQueImporta:
    "Sin etiqueta, el lector de pantalla anuncia solo «campo de texto» y la persona no sabe qué escribir. El placeholder no sirve: desaparece al escribir y muchos lectores no lo leen.",
  afectados: [
    "Personas que usan lector de pantalla",
    "Quien usa control por voz (necesita un nombre para decir «pulsa Correo»)",
    "Personas con discapacidad cognitiva o de memoria",
  ],
  malEjemplo: `<input type="email" placeholder="Correo" />`,
  bienEjemplo: `<label for="correo">Correo</label>
<input id="correo" type="email" />`,
  notaExtra:
    'También vale envolver el campo: <label>Correo <input type="email" /></label>. Si no puede haber texto visible, usa aria-label="Correo".',
  wcag: {
    criterio: "3.3.2 Etiquetas o instrucciones",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
  },
  docsUrl:
    "https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/rules/form-control-has-label.html",
};
