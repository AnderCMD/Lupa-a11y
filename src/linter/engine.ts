import { isAbsolute, relative } from "node:path";
import { findProjectConfig, lintWithProjectConfig, projectConfigFailure } from "./projectEslint";
import { runEslint } from "./runEslint";
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
  /** Presente si había config de proyecto pero no se pudo cargar (se usó el preset). */
  projectConfigError?: string;
}

function isInside(cwd: string, filePath: string): boolean {
  const rel = relative(cwd, filePath);
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}

export async function lintDocument(req: EngineRequest): Promise<EngineResult> {
  const preset = (projectConfigError?: string): EngineResult => ({
    messages: runEslint(req.text, req.filePath, req.languageId),
    usedProjectConfig: false,
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
    return {
      messages: await lintWithProjectConfig(req.text, req.filePath, cwd),
      usedProjectConfig: true,
    };
  } catch (error) {
    return preset(error instanceof Error ? error.message : String(error));
  }
}
