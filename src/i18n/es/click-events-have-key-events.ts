import type { RuleExplanation } from "../types";

export const clickEventsHaveKeyEvents: RuleExplanation = {
  ruleId: "jsx-a11y/click-events-have-key-events",
  titulo: "Clic sin equivalente de teclado",
  mensaje: "Un elemento con onClick también debe poder usarse con el teclado.",
  porQueImporta:
    "Hay personas que no usan mouse: navegan con Tab y activan con Enter o Espacio. Si solo reaccionas al clic, para ellas ese elemento no existe.",
  afectados: [
    "Personas con discapacidad motriz",
    "Usuarios de lector de pantalla",
    "Quien navega solo con teclado",
  ],
  malEjemplo: `<div onClick={abrirMenu}>Menú</div>`,
  bienEjemplo: `<button type="button" onClick={abrirMenu}>Menú</button>`,
  notaExtra:
    "Casi siempre la mejor solución es usar el elemento HTML correcto (<button>, <a>) en lugar de agregar role, tabIndex y onKeyDown a un <div>.",
  wcag: {
    criterio: "2.1.1 Teclado",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/click-events-have-key-events.md",
};
