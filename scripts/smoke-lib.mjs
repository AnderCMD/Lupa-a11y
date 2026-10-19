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
