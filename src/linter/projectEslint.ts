import { ESLint } from "eslint";
import { toLintMessages } from "./runEslint";
import type { LintMessage } from "./runEslint";

/**
 * Usa la configuración de ESLint del proyecto (flat config). Ejecutarla es
 * ejecutar código del proyecto: quien llama debe comprobar Workspace Trust.
 */
const instances = new Map<string, ESLint>();
const configLookup = new Map<string, Promise<string | undefined>>();
const failures = new Map<string, string>();

/** Olvida instancias, búsquedas y fallos (p. ej. cuando cambia eslint.config.*). */
export function resetProjectEslint(): void {
  instances.clear();
  configLookup.clear();
  failures.clear();
}

function instanceFor(cwd: string): ESLint {
  let eslint = instances.get(cwd);
  if (!eslint) {
    eslint = new ESLint({ cwd, errorOnUnmatchedPattern: false });
    instances.set(cwd, eslint);
  }
  return eslint;
}

export function findProjectConfig(cwd: string): Promise<string | undefined> {
  const cached = configLookup.get(cwd);
  if (cached) return cached;
  const found = instanceFor(cwd)
    .findConfigFile()
    .catch(() => undefined);
  configLookup.set(cwd, found);
  return found;
}

/** Mensaje del último fallo al cargar la config de este proyecto, si lo hubo. */
export function projectConfigFailure(cwd: string): string | undefined {
  return failures.get(cwd);
}

/** Lanza si la configuración del proyecto no se puede cargar. */
export async function lintWithProjectConfig(
  text: string,
  filePath: string,
  cwd: string,
): Promise<LintMessage[]> {
  try {
    const [result] = await instanceFor(cwd).lintText(text, { filePath });
    return result ? toLintMessages(result.messages) : [];
  } catch (error) {
    failures.set(cwd, error instanceof Error ? error.message : String(error));
    throw error;
  }
}
