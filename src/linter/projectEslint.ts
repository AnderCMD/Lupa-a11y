import { ESLint } from "eslint";
import { flavorFor, pluginPrefixFor } from "./flavors";
import { clearResultCache } from "./resultCache";
import { toLintMessages } from "./runEslint";
import type { LintMessage } from "./runEslint";

/**
 * Usa la configuración de ESLint del proyecto (flat config). Ejecutarla es
 * ejecutar código del proyecto: quien llama debe comprobar Workspace Trust.
 */
const instances = new Map<string, ESLint>();
const configLookup = new Map<string, Promise<string | undefined>>();
const failures = new Map<string, string>();
const coverage = new Map<string, Promise<boolean>>();

/** Olvida instancias, búsquedas y fallos (p. ej. cuando cambia eslint.config.*). */
export function resetProjectEslint(): void {
  instances.clear();
  configLookup.clear();
  failures.clear();
  coverage.clear();
  clearResultCache();
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

/**
 * ¿La config del proyecto configura reglas de accesibilidad para este archivo?
 * Si no (p. ej. un proyecto Vue cuyo ESLint no usa vuejs-accessibility), se usa
 * el preset incluido en lugar de no mostrar nada.
 */
function coversA11y(eslint: ESLint, filePath: string): Promise<boolean> {
  const flavor = flavorFor(filePath);
  if (!flavor) return Promise.resolve(false);
  let found = coverage.get(filePath);
  if (!found) {
    const prefix = pluginPrefixFor(flavor);
    found = eslint
      .calculateConfigForFile(filePath)
      .then((config: { rules?: Record<string, unknown> } | undefined) =>
        Object.keys(config?.rules ?? {}).some((id) => id.startsWith(prefix)),
      );
    coverage.set(filePath, found);
  }
  return found;
}

/**
 * Devuelve `undefined` si la config del proyecto no configura reglas de
 * accesibilidad para este archivo. Lanza si la config no se puede cargar.
 */
export async function lintWithProjectConfig(
  text: string,
  filePath: string,
  cwd: string,
): Promise<LintMessage[] | undefined> {
  try {
    const eslint = instanceFor(cwd);
    if (!(await coversA11y(eslint, filePath))) return undefined;
    const [result] = await eslint.lintText(text, { filePath });
    return result ? toLintMessages(result.messages) : [];
  } catch (error) {
    failures.set(cwd, error instanceof Error ? error.message : String(error));
    throw error;
  }
}
