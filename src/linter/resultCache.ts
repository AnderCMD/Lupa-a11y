/**
 * Último resultado por archivo: si el texto y las opciones no cambiaron (p. ej.
 * al guardar justo después de escribir), se reutiliza sin volver a analizar.
 */
const entries = new Map<string, { key: string; value: unknown }>();
const MAX_ENTRIES = 200;

export function getCached<T>(file: string, key: string): T | undefined {
  const hit = entries.get(file);
  return hit?.key === key ? (hit.value as T) : undefined;
}

export function setCached(file: string, key: string, value: unknown): void {
  entries.delete(file);
  if (entries.size >= MAX_ENTRIES) {
    const oldest = entries.keys().next().value;
    if (oldest !== undefined) entries.delete(oldest);
  }
  entries.set(file, { key, value });
}

/** Olvida lo guardado (de un archivo o de todos, p. ej. si cambia la config). */
export function clearResultCache(file?: string): void {
  if (file === undefined) entries.clear();
  else entries.delete(file);
}
