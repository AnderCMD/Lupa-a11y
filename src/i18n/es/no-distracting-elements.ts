import type { RuleExplanation } from "../types";

export const noDistractingElements: RuleExplanation = {
  ruleId: "jsx-a11y/no-distracting-elements",
  titulo: "Elemento que distrae",
  mensaje: "Evita <marquee> y <blink>: el movimiento constante dificulta leer y concentrarse.",
  porQueImporta:
    "El texto que se mueve o parpadea sin control es muy difícil de leer, y puede provocar mareos o crisis a algunas personas. Además, estos elementos están obsoletos.",
  afectados: [
    "Personas con dislexia o TDAH",
    "Personas con baja visión",
    "Personas con epilepsia fotosensible",
  ],
  malEjemplo: `<marquee>Ofertas de la semana</marquee>`,
  bienEjemplo: `<p>Ofertas de la semana</p>`,
  notaExtra: "Si necesitas animación, que se pueda pausar y respete prefers-reduced-motion.",
  wcag: {
    criterio: "2.2.2 Pausar, detener, ocultar",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-distracting-elements.md",
};
