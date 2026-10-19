import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSync } from "esbuild";
import { afterAll, describe, expect, it } from "vitest";

/**
 * El bundle de esbuild cambia la interoperabilidad CJS/ESM: una vez el parser de
 * TypeScript quedó como `undefined` y los .tsx con tipos fallaban en silencio.
 * Este test construye el motor igual que la extensión y lo prueba con código tipado.
 */
const dir = mkdtempSync(join(tmpdir(), "lupa-bundle-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("motor empaquetado con esbuild", () => {
  const outfile = join(dir, "engine.cjs");
  buildSync({
    entryPoints: [join(__dirname, "../src/linter/engine.ts")],
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node20",
    external: ["jiti"],
    outfile,
    logLevel: "silent",
  });
  const engine = createRequire(import.meta.url)(outfile) as typeof import("../src/linter/engine");

  it("analiza TSX con anotaciones de tipos", async () => {
    const code = `export function A({ a }: { a: string }) { return <img src={a} />; }`;
    const r = await engine.lintDocument({
      text: code,
      filePath: "/x/A.tsx",
      useProjectConfig: false,
    });
    expect(r.messages.map((m) => m.ruleId)).toContain("jsx-a11y/alt-text");
  });
});
