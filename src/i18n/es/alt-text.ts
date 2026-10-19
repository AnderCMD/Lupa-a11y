import type { RuleExplanation } from "../types";

export const altText: RuleExplanation = {
  ruleId: "jsx-a11y/alt-text",
  titulo: "Imagen sin texto alternativo",
  mensaje: "Esta imagen necesita un atributo alt que describa su contenido.",
  porQueImporta:
    'Los lectores de pantalla no pueden "ver" la imagen: leen el texto alternativo en voz alta. Sin él, la persona se pierde esa información o escucha el nombre del archivo.',
  afectados: [
    "Personas ciegas o con baja visión que usan lector de pantalla",
    "Cualquiera cuando la imagen no carga",
  ],
  malEjemplo: `<img src="/grafica-ventas.png" />`,
  bienEjemplo: `<img src="/grafica-ventas.png" alt="Gráfica de barras: las ventas subieron 20% en octubre" />`,
  notaExtra:
    'Si la imagen es solo decorativa, usa alt="" (vacío a propósito) para que el lector de pantalla la ignore.',
  wcag: {
    criterio: "1.1.1 Contenido no textual",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  },
  docsUrl: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md",
};
