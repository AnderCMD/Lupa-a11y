import type { RuleExplanation } from "../types";

export const interactiveSupportsFocus: RuleExplanation = {
  ruleId: "jsx-a11y/interactive-supports-focus",
  titulo: "Elemento interactivo que no recibe foco",
  mensaje: "Este elemento con role interactivo no se alcanza con Tab: agrega tabIndex={0}.",
  porQueImporta:
    "Si un elemento actúa como botón o enlace pero Tab no llega a él, quien navega con teclado no puede usarlo. Para el teclado, simplemente no existe.",
  afectados: [
    "Personas con discapacidad motriz",
    "Quien navega solo con teclado",
    "Usuarios de lector de pantalla",
  ],
  malEjemplo: `<div role="button" onClick={abrirMenu}>Menú</div>`,
  bienEjemplo: `<div role="button" tabIndex={0} onClick={abrirMenu} onKeyDown={alPulsarTecla}>Menú</div>`,
  notaExtra:
    "tabIndex={0} no basta: el elemento también debe responder a Enter y Espacio. Un <button> ya hace todo esto sin código extra.",
  wcag: {
    criterio: "2.1.1 Teclado",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/interactive-supports-focus.md",
};
