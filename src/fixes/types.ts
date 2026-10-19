/** Edición de texto por offsets (independiente de `vscode`). */
export interface FixEdit {
  start: number;
  end: number;
  newText: string;
}

export interface FixSuggestion {
  /** Título en español para la Code Action. */
  title: string;
  edits: FixEdit[];
  /** Marca la opción recomendada. */
  preferred?: boolean;
}
