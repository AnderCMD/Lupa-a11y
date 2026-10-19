/**
 * Utilidades de release.
 *
 *   tsx scripts/release.ts check [vX.Y.Z]   valida versión, etiqueta y CHANGELOG
 *   tsx scripts/release.ts notes <X.Y.Z>    imprime las notas de esa versión
 *   tsx scripts/release.ts prepare <X.Y.Z>  fija la versión y cierra "Sin publicar" en el CHANGELOG
 */
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const UNRELEASED = "## [Sin publicar]";

export function isValidVersion(version: string): boolean {
  return SEMVER.test(version);
}

export function isPrerelease(version: string): boolean {
  return version.includes("-");
}

/** Cuerpo de la sección `## [version]` del CHANGELOG, o undefined si no existe o está vacía. */
export function extractNotes(changelog: string, version: string): string | undefined {
  const lines = changelog.split("\n");
  const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
  if (start === -1) return undefined;
  const end = lines.findIndex((l, i) => i > start && l.startsWith("## ["));
  const body = lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join("\n")
    .trim();
  return body || undefined;
}

/** Convierte "Sin publicar" en la versión indicada y deja una sección vacía nueva. */
export function promoteUnreleased(changelog: string, version: string, date: string): string {
  if (!changelog.includes(UNRELEASED)) throw new Error(`Falta la sección "${UNRELEASED}"`);
  return changelog.replace(UNRELEASED, `${UNRELEASED}\n\n## [${version}] - ${date}`);
}

function setOutput(name: string, value: string): void {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const root = join(__dirname, "..");
const readPkg = () =>
  JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { version: string };
const changelogPath = join(root, "CHANGELOG.md");

function main(): void {
  const [command, arg] = process.argv.slice(2);
  switch (command) {
    case "check": {
      const { version } = readPkg();
      if (!isValidVersion(version)) fail(`Versión inválida en package.json: ${version}`);
      if (arg && arg !== `v${version}`) {
        fail(`La etiqueta ${arg} no coincide con la versión de package.json (v${version})`);
      }
      if (!extractNotes(readFileSync(changelogPath, "utf8"), version)) {
        fail(`CHANGELOG.md no tiene una sección con contenido para [${version}]`);
      }
      const prerelease = isPrerelease(version);
      setOutput("version", version);
      setOutput("prerelease", String(prerelease));
      setOutput("npm_tag", prerelease ? "next" : "latest");
      console.log(`✓ Release ${version} (${prerelease ? "pre-release" : "estable"}) lista`);
      return;
    }
    case "notes": {
      if (!arg) fail("Uso: notes <versión>");
      const notes = extractNotes(readFileSync(changelogPath, "utf8"), arg);
      if (!notes) fail(`Sin notas para ${arg}`);
      console.log(notes);
      return;
    }
    case "prepare": {
      if (!arg || !isValidVersion(arg)) fail("Uso: prepare <X.Y.Z> (semver)");
      const date = new Date().toISOString().slice(0, 10);
      writeFileSync(
        changelogPath,
        promoteUnreleased(readFileSync(changelogPath, "utf8"), arg, date),
      );
      const pkgPath = join(root, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      pkg.version = arg;
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log(
        `✓ package.json y CHANGELOG.md actualizados a ${arg}. Revisa los cambios y haz el PR.`,
      );
      return;
    }
    default:
      fail("Uso: release.ts check|notes|prepare");
  }
}

if (require.main === module) main();
