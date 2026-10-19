import type { RuleExplanation } from "../types";

export const mouseEventsHaveKeyEvents: RuleExplanation = {
  ruleId: "jsx-a11y/mouse-events-have-key-events",
  titulo: "Evento de ratón sin equivalente de teclado",
  mensaje: "onMouseOver/onMouseOut deben ir con onFocus/onBlur para quien no usa mouse.",
  porQueImporta:
    "Si algo aparece al pasar el mouse (un tooltip, un menú), quien navega con teclado nunca lo ve. onFocus y onBlur hacen que ocurra también al llegar con Tab.",
  afectados: [
    "Quien navega solo con teclado",
    "Personas que usan lector de pantalla",
    "Personas con temblor o poca precisión con el mouse",
  ],
  malEjemplo: `<button type="button" onMouseOver={mostrarAyuda} onMouseOut={ocultarAyuda}>?</button>`,
  bienEjemplo: `<button type="button" onMouseOver={mostrarAyuda} onMouseOut={ocultarAyuda} onFocus={mostrarAyuda} onBlur={ocultarAyuda}>?</button>`,
  notaExtra:
    "Asegúrate de que lo que aparece se pueda cerrar sin mover el puntero y de que no desaparezca antes de poder leerlo.",
  wcag: {
    criterio: "2.1.1 Teclado",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md",
};
