import type { RuleExplanation } from "../types";

export const roleHasRequiredAriaProps: RuleExplanation = {
  ruleId: "jsx-a11y/role-has-required-aria-props",
  titulo: "Role ARIA sin sus atributos obligatorios",
  mensaje:
    "Este role necesita atributos ARIA adicionales (por ejemplo, aria-checked en un checkbox).",
  porQueImporta:
    "Algunos roles prometen un comportamiento y deben declarar su estado: un checkbox tiene que decir si está marcado. Sin ese atributo, el lector de pantalla no puede informarlo.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<div role="checkbox" tabIndex={0}>Acepto los términos</div>`,
  bienEjemplo: `<div role="checkbox" tabIndex={0} aria-checked={aceptado}>Acepto los términos</div>`,
  notaExtra:
    'Si puedes, usa <input type="checkbox">, que ya incluye el estado y el teclado. Si usas el role, también debes actualizar aria-checked al cambiar y responder a la tecla Espacio.',
  wcag: {
    criterio: "4.1.2 Nombre, función, valor",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-has-required-aria-props.md",
};
