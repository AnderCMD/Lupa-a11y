export interface RuleExplanation {
  /** Ej. "jsx-a11y/alt-text" */
  ruleId: string;
  /** Título corto, ej. "Imagen sin texto alternativo" */
  titulo: string;
  /** Una línea para el panel Problems (máx. ~90 caracteres) */
  mensaje: string;
  /** 1-2 frases, sin jerga */
  porQueImporta: string;
  afectados: string[];
  malEjemplo: string;
  bienEjemplo: string;
  notaExtra?: string;
  wcag: {
    criterio: string;
    nivel: "A" | "AA" | "AAA" | "buena práctica";
    url: string;
  };
  /** Documentación de la regla en jsx-a11y */
  docsUrl?: string;
}
