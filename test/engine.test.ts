import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { lintDocument } from "../src/linter/engine";
import { resetProjectEslint } from "../src/linter/projectEslint";

const plugin = require.resolve("eslint-plugin-jsx-a11y");
const parser = require.resolve("@typescript-eslint/parser");

/** Código con problemas de alt-text y anchor-has-content (el preset añade alguno más). */
const CODE = `export const A = () => (<div><img src="x.png" /><a href="/p"></a></div>);\n`;

let dir: string;
beforeAll(() => {
  dir = realpathSync(mkdtempSync(join(tmpdir(), "lupa-a11y-")));
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));
afterEach(() => {
  resetProjectEslint();
  rmSync(join(dir, "eslint.config.cjs"), { force: true });
});

function writeConfig(body: string): void {
  writeFileSync(join(dir, "eslint.config.cjs"), body);
}
const file = () => join(dir, "src", "App.tsx");
const ids = (r: { messages: { ruleId: string }[] }) => r.messages.map((m) => m.ruleId).sort();

describe("lintDocument", () => {
  it("sin config de proyecto usa el preset incluido", async () => {
    const r = await lintDocument({
      text: CODE,
      filePath: file(),
      cwd: dir,
      useProjectConfig: true,
    });
    expect(r.usedProjectConfig).toBe(false);
    expect(r.projectConfigError).toBeUndefined();
    expect(ids(r)).toEqual(
      expect.arrayContaining(["jsx-a11y/alt-text", "jsx-a11y/anchor-has-content"]),
    );
  });

  it("con config de proyecto respeta sus reglas (solo jsx-a11y/*)", async () => {
    writeConfig(`module.exports = [{
      files: ["**/*.tsx"],
      plugins: { "jsx-a11y": require(${JSON.stringify(plugin)}) },
      languageOptions: { parser: require(${JSON.stringify(parser)}), parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: { "jsx-a11y/alt-text": "warn", "no-undef": "error", "no-unused-vars": "error" },
    }];`);
    const r = await lintDocument({
      text: CODE,
      filePath: file(),
      cwd: dir,
      useProjectConfig: true,
    });
    expect(r.usedProjectConfig).toBe(true);
    expect(ids(r)).toEqual(["jsx-a11y/alt-text"]);
  });

  it("con useProjectConfig=false (p. ej. workspace no confiable) ignora la config", async () => {
    writeConfig(`throw new Error("no debería ejecutarse");`);
    const r = await lintDocument({
      text: CODE,
      filePath: file(),
      cwd: dir,
      useProjectConfig: false,
    });
    expect(r.usedProjectConfig).toBe(false);
    expect(r.projectConfigError).toBeUndefined();
    expect(ids(r)).toContain("jsx-a11y/anchor-has-content");
  });

  it("si la config falla, cae al preset e informa el error", async () => {
    writeConfig(`throw new Error("config rota");`);
    const r = await lintDocument({
      text: CODE,
      filePath: file(),
      cwd: dir,
      useProjectConfig: true,
    });
    expect(r.usedProjectConfig).toBe(false);
    expect(r.projectConfigError).toContain("config rota");
    expect(ids(r)).toContain("jsx-a11y/anchor-has-content");
    // El fallo queda en caché: se sigue usando el preset sin reintentar.
    const again = await lintDocument({
      text: CODE,
      filePath: file(),
      cwd: dir,
      useProjectConfig: true,
    });
    expect(again.projectConfigError).toContain("config rota");
  });

  it("un archivo fuera del workspace usa el preset", async () => {
    writeConfig(`module.exports = [];`);
    const r = await lintDocument({
      text: CODE,
      filePath: join(tmpdir(), "otro", "A.tsx"),
      cwd: dir,
      useProjectConfig: true,
    });
    expect(r.usedProjectConfig).toBe(false);
    expect(ids(r)).toContain("jsx-a11y/anchor-has-content");
  });

  it("sintaxis rota con config de proyecto no produce ruido", async () => {
    writeConfig(`module.exports = [{
      files: ["**/*.tsx"],
      plugins: { "jsx-a11y": require(${JSON.stringify(plugin)}) },
      languageOptions: { parser: require(${JSON.stringify(parser)}) },
      rules: { "jsx-a11y/alt-text": "warn" },
    }];`);
    const r = await lintDocument({
      text: "const a = <img src=",
      filePath: file(),
      cwd: dir,
      useProjectConfig: true,
    });
    expect(r.messages).toEqual([]);
  });
});
