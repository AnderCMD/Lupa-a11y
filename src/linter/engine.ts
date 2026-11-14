import { isAbsolute, relative } from "node:path";
import { findProjectConfig, lintWithProjectConfig, projectConfigFailure } from "./projectEslint";
import { flavorFor } from "./flavors";
import type { Flavor } from "./flavors";
import { getCached, setCached } from "./resultCache";
import { runEslint } from "./runEslint";

export { clearResultCache } from "./resultCache";
import type { LintMessage } from "./runEslint";

export interface EngineRequest {
  text: string;
  filePath: string;
  /** Idioma del editor (`typescriptreact` / `javascriptreact`). */
  languageId?: string;
  /** Carpeta del workspace del archivo (solo si es del sistema de archivos). */
  cwd?: string;
  /** `useProjectEslintConfig` ya combinado con Workspace Trust. */
  useProjectConfig: boolean;
}

export interface EngineResult {
  messages: LintMessage[];
  usedProjectConfig: boolean;
  /** Familia de sintaxis detectada; `undefined` si el archivo no es compatible. */
  flavor?: Flavor;
  /** Presente si había config de proyecto pero no se pudo cargar (se usó el preset). */
  projectConfigError?: string;
}

function isInside(cwd: string, filePath: string): boolean {
  const rel = relative(cwd, filePath);
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}

export async function lintDocument(req: EngineRequest): Promise<EngineResult> {
  const key = `${req.useProjectConfig}|${req.cwd ?? ""}|${req.languageId ?? ""}|${req.text}`;
  const cached = getCached<EngineResult>(req.filePath, key);
  if (cached) return cached;
  const result = await lintUncached(req);
  // La config del proyecto puede fallar de forma transitoria: solo se guarda lo estable.
  if (!result.projectConfigError) setCached(req.filePath, key, result);
  return result;
}

async function lintUncached(req: EngineRequest): Promise<EngineResult> {
  const flavor = flavorFor(req.filePath, req.languageId);
  if (!flavor) return { messages: [], usedProjectConfig: false };
  const preset = (projectConfigError?: string): EngineResult => ({
    messages: runEslint(req.text, req.filePath, req.languageId),
    usedProjectConfig: false,
    flavor,
    projectConfigError,
  });

  const { cwd } = req;
  if (!req.useProjectConfig || !cwd || !isInside(cwd, req.filePath)) {
    return preset();
  }
  if (!(await findProjectConfig(cwd))) return preset();

  // Fallo ya conocido: no se reintenta en cada pulsación hasta que cambie la config.
  const known = projectConfigFailure(cwd);
  if (known) return preset(known);

  try {
    const messages = await lintWithProjectConfig(req.text, req.filePath, cwd);
    if (!messages) return preset();
    return { messages, usedProjectConfig: true, flavor };
  } catch (error) {
    return preset(error instanceof Error ? error.message : String(error));
  }
}
