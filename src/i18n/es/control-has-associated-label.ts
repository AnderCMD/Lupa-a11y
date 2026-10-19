import type { RuleExplanation } from "../types";

export const controlHasAssociatedLabel: RuleExplanation = {
  ruleId: "jsx-a11y/control-has-associated-label",
  titulo: "Control sin nombre accesible",
  mensaje: "Este control no tiene texto que lo nombre: agrega texto visible o aria-label.",
  porQueImporta:
    'Un botón con solo un icono se anuncia como "botón" sin decir qué hace. La persona tendría que adivinar qué ocurre al activarlo.',
  afectados: ["Personas que usan lector de pantalla", "Quien usa control por voz"],
  malEjemplo: `<button type="button" onClick={cerrar}>
  <i className="icono-cerrar" />
</button>`,
  bienEjemplo: `<button type="button" onClick={cerrar} aria-label="Cerrar">
  <i className="icono-cerrar" aria-hidden="true" />
</button>`,
  notaExtra:
    "Prefiere texto visible: también ayuda a quien ve pero no reconoce el icono. Usa aria-label cuando el diseño solo permita el icono.",
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/control-has-associated-label.md",
};
