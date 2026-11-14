/**
 * CLI de Lupa A11y: el mismo motor que la extensión, para CI y hooks de git.
 *
 *   npx lupa-a11y src/ --max-warnings 0
 *   npx lupa-a11y src/ app/ --format json > a11y.json
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { lintDocument } from "./linter/engine";
import { SUPPORTED_EXTENSIONS, flavorFor } from "./linter/flavors";
import { mapMessages } from "./linter/mapDiagnostics";
import type { MappedDiagnostic } from "./linter/mapDiagnostics";

const EXCLUDED_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  ".git",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".astro",
  ".output",
  ".vercel",
  ".turbo",
  ".angular",
]);

export interface CliIO {
  cwd: string;
  out: (line: string) => void;
  err: (line: string) => void;
}

interface Options {
  paths: string[];
  format: "text" | "json";
  maxWarnings: number;
  ignoreRules: string[];
  projectConfig: boolean;
  maxFileSizeKb: number;
}

export const HELP = `Uso: lupa-a11y [rutas...] [opciones]

Analiza la accesibilidad de archivos JSX/TSX, Vue, Svelte, Astro y HTML
(incluye plantillas de Angular) con mensajes en español.

Opciones:
  --format <text|json>    Formato de salida (por defecto: text)
  --max-warnings <n>      Sale con código 1 si hay más de n problemas (por defecto: 0)
  --ignore-rule <id>      Regla a ignorar; se puede repetir
  --project-config        Usa el eslint.config.* del proyecto si configura reglas de accesibilidad
  --max-file-size <kb>    Omite archivos más grandes (por defecto: 500)
  -h, --help              Muestra esta ayuda

Códigos de salida: 0 sin problemas (o dentro del límite), 1 problemas, 2 error de uso.`;

export function parseArgs(argv: readonly string[]): Options | string {
  const o: Options = {
    paths: [],
    format: "text",
    maxWarnings: 0,
    ignoreRules: [],
    projectConfig: false,
    maxFileSizeKb: 500,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    const value = (): string | undefined => argv[++i];
    switch (arg) {
      case "-h":
      case "--help":
        return "help";
      case "--format": {
        const v = value();
        if (v !== "text" && v !== "json") return `--format debe ser text o json`;
        o.format = v;
        break;
      }
      case "--max-warnings": {
        const n = Number(value());
        if (!Number.isInteger(n) || n < 0) return "--max-warnings necesita un entero ≥ 0";
        o.maxWarnings = n;
        break;
      }
      case "--max-file-size": {
        const n = Number(value());
        if (!(n > 0)) return "--max-file-size necesita un número > 0";
        o.maxFileSizeKb = n;
        break;
      }
      case "--ignore-rule": {
        const v = value();
        if (!v) return "--ignore-rule necesita el id de una regla";
        o.ignoreRules.push(v);
        break;
      }
      case "--project-config":
        o.projectConfig = true;
        break;
      default:
        if (arg.startsWith("-")) return `Opción desconocida: ${arg}`;
        o.paths.push(arg);
    }
  }
  if (o.paths.length === 0) o.paths.push(".");
  return o;
}

const EXT = new RegExp(`\\.(${SUPPORTED_EXTENSIONS.join("|")})$`, "i");

async function collect(path: string, out: string[]): Promise<void> {
  const info = await stat(path);
  if (info.isFile()) {
    if (flavorFor(path)) out.push(path);
    return;
  }
  if (!info.isDirectory()) return;
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) await collect(join(path, entry.name), out);
    } else if (entry.isFile() && EXT.test(entry.name)) {
      out.push(join(path, entry.name));
    }
  }
}

interface FileReport {
  file: string;
  diagnostics: MappedDiagnostic[];
}

export async function runCli(argv: readonly string[], io: CliIO): Promise<number> {
  const parsed = parseArgs(argv);
  if (parsed === "help") {
    io.out(HELP);
    return 0;
  }
  if (typeof parsed === "string") {
    io.err(`lupa-a11y: ${parsed}\n\n${HELP}`);
    return 2;
  }

  const files: string[] = [];
  for (const p of parsed.paths) {
    try {
      await collect(resolve(io.cwd, p), files);
    } catch {
      io.err(`lupa-a11y: no existe la ruta ${p}`);
      return 2;
    }
  }
  files.sort();

  const reports: FileReport[] = [];
  let skipped = 0;
  for (const file of files) {
    const text = await readFile(file, "utf8");
    if (text.length > parsed.maxFileSizeKb * 1024) {
      skipped++;
      continue;
    }
    const result = await lintDocument({
      text,
      filePath: file,
      cwd: io.cwd,
      useProjectConfig: parsed.projectConfig,
    });
    if (result.projectConfigError) {
      io.err(
        `Aviso: no se pudo cargar eslint.config.* (${result.projectConfigError}); se usa el preset.`,
      );
    }
    const diagnostics = mapMessages(result.messages, parsed.ignoreRules);
    if (diagnostics.length) reports.push({ file: relative(io.cwd, file) || file, diagnostics });
  }

  const total = reports.reduce((n, r) => n + r.diagnostics.length, 0);
  if (parsed.format === "json") {
    io.out(
      JSON.stringify(
        {
          archivos: files.length,
          omitidos: skipped,
          problemas: total,
          resultados: reports.map((r) => ({
            archivo: r.file,
            problemas: r.diagnostics.map((d) => ({
              regla: d.ruleId,
              mensaje: d.message,
              linea: d.startLine + 1,
              columna: d.startCharacter + 1,
              lineaFin: d.endLine + 1,
              columnaFin: d.endCharacter + 1,
              documentacion: d.docsUrl,
            })),
          })),
        },
        null,
        2,
      ),
    );
  } else {
    for (const r of reports) {
      io.out(r.file);
      for (const d of r.diagnostics) {
        io.out(`  ${d.startLine + 1}:${d.startCharacter + 1}  ${d.message}  ${d.ruleId}`);
      }
      io.out("");
    }
    const resumen =
      total === 0
        ? `✓ Sin problemas de accesibilidad en ${files.length} archivo${files.length === 1 ? "" : "s"}.`
        : `✗ ${total} problema${total === 1 ? "" : "s"} en ${reports.length} de ${files.length} archivos.`;
    io.out(skipped ? `${resumen} (${skipped} omitidos por tamaño)` : resumen);
  }
  return total > parsed.maxWarnings ? 1 : 0;
}
