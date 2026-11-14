import { describe, expect, it } from "vitest";
import { ALIASES, getExplanation, listExplanations } from "../src/i18n";
import { mapMessages } from "../src/linter/mapDiagnostics";
import { runEslint } from "../src/linter/runEslint";

/** [regla, archivo, código malo, código bueno]. */
type Case = [string, string, string, string];

const vue = (body: string) => `<template>\n  ${body}\n</template>\n`;

const VUE: Case[] = [
  ["alt-text", "A.vue", vue(`<img src="a.png">`), vue(`<img src="a.png" alt="Gráfica">`)],
  ["anchor-has-content", "A.vue", vue(`<a href="/p"></a>`), vue(`<a href="/p">Precios</a>`)],
  [
    "aria-props",
    "A.vue",
    vue(`<div aria-labeledby="t">x</div>`),
    vue(`<div aria-labelledby="t">x</div>`),
  ],
  [
    "aria-role",
    "A.vue",
    vue(`<div role="boton">x</div>`),
    vue(`<div role="button" tabindex="0" @click="f" @keydown.enter="f">x</div>`),
  ],
  [
    "aria-unsupported-elements",
    "A.vue",
    vue(`<meta charset="utf-8" aria-hidden="true">`),
    vue(`<meta charset="utf-8">`),
  ],
  [
    "click-events-have-key-events",
    "A.vue",
    vue(`<div role="button" tabindex="0" @click="f">x</div>`),
    vue(`<div role="button" tabindex="0" @click="f" @keydown.enter="f">x</div>`),
  ],
  [
    "form-control-has-label",
    "A.vue",
    vue(`<input type="text" v-model="q">`),
    vue(`<label>Buscar <input type="text" v-model="q"></label>`),
  ],
  ["heading-has-content", "A.vue", vue(`<h1></h1>`), vue(`<h1>Título</h1>`)],
  [
    "iframe-has-title",
    "A.vue",
    vue(`<iframe src="/mapa"></iframe>`),
    vue(`<iframe src="/mapa" title="Mapa de la tienda"></iframe>`),
  ],
  [
    "interactive-supports-focus",
    "A.vue",
    vue(`<div role="button" @click="f" @keydown.enter="f">x</div>`),
    vue(`<div role="button" tabindex="0" @click="f" @keydown.enter="f">x</div>`),
  ],
  [
    "label-has-for",
    "A.vue",
    vue(`<label>Nombre</label>`),
    vue(`<label for="n">Nombre <input id="n" type="text"></label>`),
  ],
  [
    "media-has-caption",
    "A.vue",
    vue(`<video src="/v.mp4"></video>`),
    vue(`<video src="/v.mp4"><track kind="captions" src="/v.vtt"></video>`),
  ],
  [
    "mouse-events-have-key-events",
    "A.vue",
    vue(`<button type="button" @mouseover="f">x</button>`),
    vue(`<button type="button" @mouseover="f" @focus="f">x</button>`),
  ],
  [
    "no-access-key",
    "A.vue",
    vue(`<button type="button" accesskey="s">x</button>`),
    vue(`<button type="button">x</button>`),
  ],
  [
    "no-aria-hidden-on-focusable",
    "A.vue",
    vue(`<button type="button" aria-hidden="true">x</button>`),
    vue(`<button type="button">x</button>`),
  ],
  [
    "no-autofocus",
    "A.vue",
    vue(`<button type="button" autofocus>x</button>`),
    vue(`<button type="button">x</button>`),
  ],
  ["no-distracting-elements", "A.vue", vue(`<marquee>Oferta</marquee>`), vue(`<p>Oferta</p>`)],
  [
    "no-redundant-roles",
    "A.vue",
    vue(`<button type="button" role="button">x</button>`),
    vue(`<button type="button">x</button>`),
  ],
  [
    "no-role-presentation-on-focusable",
    "A.vue",
    vue(`<button type="button" role="presentation">x</button>`),
    vue(`<button type="button">x</button>`),
  ],
  [
    "no-static-element-interactions",
    "A.vue",
    vue(`<div @click="f" @keydown.enter="f">x</div>`),
    vue(`<button type="button" @click="f">x</button>`),
  ],
  [
    "role-has-required-aria-props",
    "A.vue",
    vue(`<span role="checkbox" tabindex="0" @click="f" @keydown.space="f">x</span>`),
    vue(
      `<span role="checkbox" aria-checked="false" tabindex="0" @click="f" @keydown.space="f">x</span>`,
    ),
  ],
  [
    "tabindex-no-positive",
    "A.vue",
    vue(`<button type="button" tabindex="2">x</button>`),
    vue(`<button type="button" tabindex="0">x</button>`),
  ],
].map(([r, ...rest]) => [`vuejs-accessibility/${r}`, ...rest] as Case);

const page = (head: string, body: string) =>
  `<!DOCTYPE html>\n<html lang="es">\n<head><title>Página</title>${head}</head>\n<body>\n${body}\n</body>\n</html>\n`;

const HTML: Case[] = [
  [
    "require-img-alt",
    "a.html",
    page("", `<img src="a.png">`),
    page("", `<img src="a.png" alt="">`),
  ],
  [
    "require-frame-title",
    "a.html",
    page("", `<iframe src="/m"></iframe>`),
    page("", `<iframe src="/m" title="Mapa"></iframe>`),
  ],
  [
    "no-positive-tabindex",
    "a.html",
    page("", `<button type="button" tabindex="2">x</button>`),
    page("", `<button type="button">x</button>`),
  ],
  [
    "no-accesskey-attrs",
    "a.html",
    page("", `<button type="button" accesskey="s">x</button>`),
    page("", `<button type="button">x</button>`),
  ],
  [
    "no-invalid-role",
    "a.html",
    page("", `<div role="boton">x</div>`),
    page("", `<div role="note">x</div>`),
  ],
  [
    "no-abstract-roles",
    "a.html",
    page("", `<div role="widget">x</div>`),
    page("", `<nav aria-label="Principal">x</nav>`),
  ],
  [
    "no-aria-hidden-on-focusable",
    "a.html",
    page("", `<a href="/x" aria-hidden="true">x</a>`),
    page("", `<a href="/x">x</a>`),
  ],
  [
    "no-aria-hidden-body",
    "a.html",
    `<!DOCTYPE html>\n<html lang="es"><head><title>P</title></head><body aria-hidden="true"><p>x</p></body></html>`,
    page("", `<p>x</p>`),
  ],
  [
    "no-redundant-role",
    "a.html",
    page("", `<button type="button" role="button">x</button>`),
    page("", `<button type="button">x</button>`),
  ],
  ["no-empty-headings", "a.html", page("", `<h1></h1>`), page("", `<h1>Hola</h1>`)],
  [
    "no-skip-heading-levels",
    "a.html",
    page("", `<h1>Tienda</h1><h3>Ofertas</h3>`),
    page("", `<h1>Tienda</h1><h2>Ofertas</h2>`),
  ],
  [
    "no-heading-inside-button",
    "a.html",
    page("", `<button type="button"><h2>FAQ</h2></button>`),
    page("", `<h2><button type="button">FAQ</button></h2>`),
  ],
  [
    "no-non-scalable-viewport",
    "a.html",
    page(`<meta name="viewport" content="width=device-width, user-scalable=no">`, ""),
    page(`<meta name="viewport" content="width=device-width, initial-scale=1">`, ""),
  ],
  [
    "require-input-label",
    "a.html",
    page("", `<input type="email">`),
    page("", `<label>Correo <input type="email"></label>`),
  ],
  [
    "require-lang",
    "a.html",
    `<!DOCTYPE html>\n<html><head><title>P</title></head><body></body></html>`,
    page("", ""),
  ],
  [
    "require-title",
    "a.html",
    `<!DOCTYPE html>\n<html lang="es"><head><meta charset="utf-8"></head><body></body></html>`,
    page("", ""),
  ],
].map(([r, ...rest]) => [`@html-eslint/${r}`, ...rest] as Case);

const lint = (code: string, file: string) => mapMessages(runEslint(code, file));

describe.each([...VUE, ...HTML])("%s", (ruleId, file, malo, bueno) => {
  it("el código malo produce el diagnóstico en español", () => {
    const found = lint(malo, file).filter((d) => d.ruleId === ruleId);
    expect(found, JSON.stringify(lint(malo, file).map((d) => d.ruleId))).toHaveLength(1);
    expect(found[0]?.translated).toBe(true);
    expect(found[0]?.message).toBe(getExplanation(ruleId)?.mensaje);
  });

  it("el código bueno no produce diagnósticos", () => {
    expect(lint(bueno, file).map((d) => d.ruleId)).toEqual([]);
  });
});

describe("cobertura de frameworks", () => {
  it("cada alias y cada regla propia de Vue/HTML tiene un caso", () => {
    const covered = new Set([...VUE, ...HTML].map(([id]) => id));
    const own = listExplanations("es")
      .map((t) => t.ruleId)
      .filter((id) => !id.startsWith("jsx-a11y/"));
    for (const id of [...Object.keys(ALIASES), ...own]) expect(covered, id).toContain(id);
  });

  it("cada alias apunta a una explicación existente", () => {
    for (const [from, to] of Object.entries(ALIASES)) {
      expect(getExplanation(to), `${from} → ${to}`).toBeDefined();
    }
  });
});

describe("Svelte", () => {
  const ids = (code: string) => runEslint(code, "A.svelte").map((m) => m.ruleId);

  it("detecta problemas dentro de bloques {#if}", () => {
    expect(ids(`{#if ok}<img src="a.png">{/if}`)).toEqual(["@html-eslint/require-img-alt"]);
  });

  it("entiende alt={expr}, el atajo {alt} y eventos con =>", () => {
    const code = `<script>let alt = ""; let n = 0;</script>
<img src="a.png" alt={alt} />
<img src="b.png" {alt} />
<button type="button" on:click={() => n > 1 && n++}>+</button>
<h1>{titulo}</h1>`;
    expect(ids(code)).toEqual([]);
  });

  it("sigue detectando problemas después de una expresión con >", () => {
    expect(ids(`<button on:click={() => a > b}>x</button><img src="x">`)).toEqual([
      "@html-eslint/require-img-alt",
    ]);
  });

  it("las posiciones apuntan al texto original", () => {
    const code = `<script>const a = { b: 1 };</script>\n<p>{a.b}</p>\n<img src="x">`;
    const [m] = runEslint(code, "A.svelte");
    expect(m).toMatchObject({ line: 3, column: 1 });
  });
});

describe("Astro", () => {
  it("ignora el frontmatter y respeta las posiciones", () => {
    const code = `---\nconst el = <img src="q" />;\n---\n<main><img src="a.png" /></main>`;
    const msgs = runEslint(code, "A.astro");
    expect(msgs.map((m) => m.ruleId)).toEqual(["@html-eslint/require-img-alt"]);
    expect(msgs[0]).toMatchObject({ line: 4, column: 7 });
  });
});

describe("plantillas de Angular", () => {
  const ids = (code: string) => runEslint(code, "app.component.html").map((m) => m.ruleId);

  it("[alt], [attr.alt] y bind-alt cuentan como alt", () => {
    expect(
      ids(`<img [alt]="a" src="x"><img [attr.alt]="a" src="y"><img bind-alt="a" src="z">`),
    ).toEqual([]);
  });

  it("detecta imágenes sin alt y tolera @if y {{ a > b }}", () => {
    expect(ids(`@if (x) { <span>{{ a > b }}</span> }\n<img [src]="u">`)).toEqual([
      "@html-eslint/require-img-alt",
    ]);
  });
});

describe("JavaScript con JSX (.js)", () => {
  it("analiza JSX en archivos .js", () => {
    expect(
      runEslint(`export const A = () => <img src="x" />;`, "A.js").map((m) => m.ruleId),
    ).toEqual(["jsx-a11y/alt-text"]);
  });

  it("un .js sin JSX no da problemas", () => {
    expect(runEslint(`export const a = 1 < 2 && 3 > 1;`, "a.js")).toEqual([]);
  });
});

describe("ignoreRules entre frameworks", () => {
  it("ignorar jsx-a11y/alt-text también ignora sus equivalentes de Vue y HTML", () => {
    const vueMsgs = runEslint(vue(`<img src="a.png">`), "A.vue");
    const htmlMsgs = runEslint(`<img src="a.png">`, "a.html");
    expect(mapMessages([...vueMsgs, ...htmlMsgs], ["jsx-a11y/alt-text"])).toEqual([]);
  });

  it("el enlace de documentación es el de la regla real", () => {
    const [d] = mapMessages(runEslint(vue(`<img src="a.png">`), "A.vue"));
    expect(d?.docsUrl).toContain("vue-a11y.github.io");
    expect(d?.canonicalRuleId).toBe("jsx-a11y/alt-text");
  });
});
