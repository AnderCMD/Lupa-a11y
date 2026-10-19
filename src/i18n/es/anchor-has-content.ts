import type { RuleExplanation } from "../types";

export const anchorHasContent: RuleExplanation = {
  ruleId: "jsx-a11y/anchor-has-content",
  titulo: "Enlace sin contenido",
  mensaje: "Este enlace no tiene texto: agrega contenido que diga a dónde lleva.",
  porQueImporta:
    'Un enlace vacío se anuncia solo como "enlace", o se lee su URL completa. La persona no sabe a dónde la llevaría ni puede decidir si le interesa.',
  afectados: [
    "Personas que usan lector de pantalla",
    "Quien usa control por voz (no puede decir el nombre de un enlace que no lo tiene)",
  ],
  malEjemplo: `<a href="/precios"></a>`,
  bienEjemplo: `<a href="/precios">Precios</a>`,
  notaExtra:
    "Si el enlace solo muestra un icono, incluye texto que describa el destino; puedes ocultarlo visualmente con una clase pensada para lectores de pantalla.",
  wcag: {
    criterio: "2.4.4 Propósito de los enlaces (en contexto)",
    nivel: "A",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-has-content.md",
};
