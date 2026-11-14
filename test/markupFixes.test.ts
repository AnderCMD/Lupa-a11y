import { describe, expect, it } from "vitest";
import { applyEdits, getFixes } from "../src/fixes";
import { tagAt } from "../src/fixes/markup";
import { flavorFor } from "../src/linter/flavors";
import { runEslint } from "../src/linter/runEslint";

function offsetAt(text: string, line: number, column: number): number {
  const lines = text.split("\n");
  let offset = 0;
  for (let i = 0; i < line - 1; i++) offset += (lines[i]?.length ?? 0) + 1;
  return offset + column - 1;
}

/** Aplica el fix `title` al primer diagnóstico de `ruleId` y devuelve el resultado. */
function applyFix(file: string, code: string, ruleId: string, title: string): string {
  const msg = runEslint(code, file).find((m) => m.ruleId === ruleId);
  expect(msg, `${ruleId} debe dispararse`).toBeDefined();
  const fixes = getFixes(ruleId, code, offsetAt(code, msg!.line, msg!.column), flavorFor(file));
  const fix = fixes.find((f) => f.title === title);
  expect(fix, `fixes: ${fixes.map((f) => f.title).join(" | ")}`).toBeDefined();
  const out = applyEdits(code, fix!.edits);
  expect(runEslint(out, file).map((m) => m.ruleId)).not.toContain(ruleId);
  return out;
}

const DECORATIVA = 'Marcar la imagen como decorativa (alt="")';

describe("quick fixes en plantillas", () => {
  it("Vue: alt vacío", () => {
    const code = `<template>\n  <img :src="url">\n</template>\n`;
    expect(applyFix("A.vue", code, "vuejs-accessibility/alt-text", DECORATIVA)).toContain(
      '<img alt="" :src="url">',
    );
  });

  it("HTML: alt vacío y TODO", () => {
    const code = `<img src="a.png">`;
    expect(applyFix("a.html", code, "@html-eslint/require-img-alt", DECORATIVA)).toBe(
      `<img alt="" src="a.png">`,
    );
    expect(
      applyFix(
        "a.html",
        code,
        "@html-eslint/require-img-alt",
        'Agregar alt="TODO: describe lo que muestra"',
      ),
    ).toContain("TODO");
  });

  it("Svelte: alt vacío aunque haya expresiones con =>", () => {
    const code = `<img on:load={() => n > 0} src={url}>`;
    expect(applyFix("A.svelte", code, "@html-eslint/require-img-alt", DECORATIVA)).toBe(
      `<img alt="" on:load={() => n > 0} src={url}>`,
    );
  });

  it("HTML: lang en <html>", () => {
    const code = `<!DOCTYPE html>\n<html><head><title>P</title></head><body></body></html>`;
    expect(
      applyFix("a.html", code, "@html-eslint/require-lang", 'Agregar lang="es" a <html>'),
    ).toContain('<html lang="es">');
  });

  it("tabindex positivo → 0, respetando la forma del valor", () => {
    expect(
      applyFix(
        "A.vue",
        `<template><button type="button" tabindex="3">x</button></template>`,
        "vuejs-accessibility/tabindex-no-positive",
        'Reemplazar por tabindex="0"',
      ),
    ).toContain('tabindex="0"');
    expect(
      applyFix(
        "A.svelte",
        `<button type="button" tabindex={3}>x</button>`,
        "@html-eslint/no-positive-tabindex",
        "Reemplazar por tabindex={0}",
      ),
    ).toContain("tabindex={0}");
  });

  it("Vue: quitar autofocus sin dejar espacios", () => {
    const code = `<template><input type="text" aria-label="q" autofocus></template>`;
    expect(applyFix("A.vue", code, "vuejs-accessibility/no-autofocus", "Quitar autofocus")).toBe(
      `<template><input type="text" aria-label="q"></template>`,
    );
  });

  it("no ofrece alt si ya hay un binding :alt o v-bind", () => {
    expect(getFixes("jsx-a11y/alt-text", `<img :alt="a">`, 0, "vue")).toEqual([]);
    expect(getFixes("jsx-a11y/alt-text", `<img v-bind="props">`, 0, "vue")).toEqual([]);
  });
});

describe("tagAt", () => {
  it("encuentra la etiqueta desde un atributo", () => {
    const code = `<p>x</p><button type="button" tabindex="2">`;
    const tag = tagAt(code, code.indexOf("tabindex"));
    expect(tag?.name).toBe("button");
    expect(tag?.attrs.map((a) => a.name)).toEqual(["type", "tabindex"]);
  });

  it("devuelve undefined fuera de una etiqueta", () => {
    expect(tagAt(`<p>hola</p>`, 4)).toBeUndefined();
  });
});
