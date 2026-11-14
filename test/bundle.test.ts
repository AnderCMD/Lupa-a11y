import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "esbuild";
import { sharedBundleOptions } from "../scripts/esbuild-shared.mjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * El bundle de esbuild cambia la interoperabilidad CJS/ESM: una vez el parser de
 * TypeScript quedó como `undefined` y los .tsx con tipos fallaban en silencio.
 * Este test construye el motor igual que la extensión y lo prueba con código tipado.
 */
const dir = mkdtempSync(join(tmpdir(), "lupa-bundle-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("motor empaquetado con esbuild", () => {
  const outfile = join(dir, "engine.cjs");
  let engine: typeof import("../src/linter/engine");

  beforeAll(async () => {
    await build({
      ...sharedBundleOptions,
      entryPoints: [join(__dirname, "../src/linter/engine.ts")],
      bundle: true,
      platform: "node",
      format: "cjs",
      target: "node20",
      external: ["jiti"],
      outfile,
      logLevel: "silent",
    });
    // Se carga desde una carpeta temporal, sin node_modules (como en el .vsix).
    engine = createRequire(import.meta.url)(outfile) as typeof engine;
  });

  const ruleIds = async (text: string, filePath: string) =>
    (await engine.lintDocument({ text, filePath, useProjectConfig: false })).messages.map(
      (m) => m.ruleId,
    );

  it("analiza TSX con anotaciones de tipos", async () => {
    const code = `export function A({ a }: { a: string }) { return <img src={a} />; }`;
    expect(await ruleIds(code, "/x/A.tsx")).toContain("jsx-a11y/alt-text");
  });

  it('analiza Vue con <script lang="ts">', async () => {
    const code = `<template><img src="a.png"></template>\n<script setup lang="ts">const n: number = 1;</script>`;
    expect(await ruleIds(code, "/x/A.vue")).toContain("vuejs-accessibility/alt-text");
  });

  it("analiza HTML, Svelte y Astro", async () => {
    for (const file of ["/x/a.html", "/x/A.svelte", "/x/A.astro"]) {
      expect(await ruleIds(`<img src="a.png">`, file)).toContain("@html-eslint/require-img-alt");
    }
  });
});
