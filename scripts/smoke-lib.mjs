// Comprueba que la librería construida funciona como ESM y como CJS.
import { createRequire } from "node:module";
import { strict as assert } from "node:assert";

const code = "export const A = ({ a }: { a: string }) => <img src={a} />;";
const esm = await import("../dist-lib/index.mjs");
const cjs = createRequire(import.meta.url)("../dist-lib/index.cjs");

for (const [name, lib] of [
  ["ESM", esm],
  ["CJS", cjs],
]) {
  const [d] = lib.mapMessages(lib.runEslint(code, "A.tsx", "typescriptreact"));
  assert.ok(d, `${name}: debe detectar la imagen sin alt`);
  assert.equal(d.ruleId, "jsx-a11y/alt-text");
  assert.match(d.message, /atributo alt/);
  assert.ok(lib.getExplanation(d.ruleId)?.titulo);
  const fix = lib.getFixes(d.ruleId, code, code.indexOf("<img"))[0];
  assert.ok(lib.applyEdits(code, fix.edits).includes('alt=""'));
  assert.ok(lib.listExplanations("es").length >= 18);
  console.log(`  ✓ ${name}`);
}

// Vue, HTML y la CLI.
for (const [name, lib] of [
  ["ESM", esm],
  ["CJS", cjs],
]) {
  const vue = lib.runEslint(`<template><img src="a.png"></template>`, "A.vue");
  assert.equal(vue[0]?.ruleId, "vuejs-accessibility/alt-text", `${name}: Vue`);
  const html = lib.runEslint(`<img src="a.png">`, "a.html");
  assert.equal(html[0]?.ruleId, "@html-eslint/require-img-alt", `${name}: HTML`);
  console.log(`  ✓ ${name} (Vue y HTML)`);
}

const { execFileSync } = await import("node:child_process");
const { fileURLToPath } = await import("node:url");
const help = execFileSync(
  process.execPath,
  [fileURLToPath(new URL("../dist-lib/cli.cjs", import.meta.url)), "--help"],
  {
    encoding: "utf8",
  },
);
assert.match(help, /Uso: lupa-a11y/);
console.log("  ✓ CLI");
