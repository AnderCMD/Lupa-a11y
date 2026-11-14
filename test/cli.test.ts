import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseArgs, runCli } from "../src/cli";

let dir: string;
beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "lupa-cli-"));
  mkdirSync(join(dir, "src"));
  mkdirSync(join(dir, "node_modules", "pkg"), { recursive: true });
  writeFileSync(join(dir, "src", "App.tsx"), `export const A = () => <img src="a.png" />;\n`);
  writeFileSync(join(dir, "src", "Ok.vue"), `<template><img src="a.png" alt=""></template>\n`);
  writeFileSync(join(dir, "src", "page.html"), `<html><head><title>x</title></head></html>\n`);
  writeFileSync(join(dir, "src", "notas.md"), `<img src="a.png">\n`);
  writeFileSync(join(dir, "node_modules", "pkg", "x.jsx"), `const a = <img />;\n`);
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

async function run(...argv: string[]) {
  const out: string[] = [];
  const err: string[] = [];
  const code = await runCli(argv, { cwd: dir, out: (l) => out.push(l), err: (l) => err.push(l) });
  return { code, out: out.join("\n"), err: err.join("\n") };
}

describe("CLI", () => {
  it("informa los problemas en español y sale con 1", async () => {
    const r = await run("src");
    expect(r.code).toBe(1);
    expect(r.out).toContain(join("src", "App.tsx"));
    expect(r.out).toContain("1:24  Esta imagen necesita un atributo alt");
    expect(r.out).toContain("@html-eslint/require-lang");
    expect(r.out).toMatch(/✗ 2 problemas en 2 de 3 archivos/);
  });

  it("omite node_modules y archivos no compatibles", async () => {
    const r = await run(".", "--format", "json");
    const json = JSON.parse(r.out) as { archivos: number; resultados: { archivo: string }[] };
    expect(json.archivos).toBe(3);
    expect(json.resultados.map((x) => x.archivo).join()).not.toContain("node_modules");
  });

  it("respeta --ignore-rule y --max-warnings", async () => {
    expect((await run("src", "--max-warnings", "2")).code).toBe(0);
    const r = await run(
      "src",
      "--ignore-rule",
      "jsx-a11y/alt-text",
      "--ignore-rule",
      "jsx-a11y/html-has-lang",
    );
    expect(r.code).toBe(0);
    expect(r.out).toContain("✓ Sin problemas de accesibilidad en 3 archivos.");
  });

  it("JSON con posiciones base 1", async () => {
    const r = await run(join("src", "App.tsx"), "--format", "json");
    const json = JSON.parse(r.out);
    expect(json.resultados[0].problemas[0]).toMatchObject({
      regla: "jsx-a11y/alt-text",
      linea: 1,
      columna: 24,
    });
  });

  it("errores de uso salen con 2", async () => {
    expect((await run("--format", "xml")).code).toBe(2);
    expect((await run("no-existe")).code).toBe(2);
    expect((await run("--help")).out).toContain("Uso: lupa-a11y");
  });

  it("parseArgs usa . por defecto", () => {
    expect(parseArgs([])).toMatchObject({ paths: ["."], format: "text", maxWarnings: 0 });
  });
});
