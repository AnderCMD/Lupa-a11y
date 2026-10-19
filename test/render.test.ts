import { describe, expect, it } from "vitest";
import { getExplanation } from "../src/i18n";
import {
  escapeHtml,
  explanationCommandUri,
  highlightJsx,
  renderHoverMarkdown,
  renderPanelHtml,
} from "../src/ui/render";

const alt = getExplanation("jsx-a11y/alt-text")!;
const click = getExplanation("jsx-a11y/click-events-have-key-events")!;
const opts = {
  cspSource: "vscode-webview://x",
  logoUri: "vscode-webview://x/logo.svg",
  nonce: "abc123",
};

describe("hover", () => {
  it.each([alt, click])("incluye título, motivo, ejemplos, WCAG y comando ($ruleId)", (e) => {
    const md = renderHoverMarkdown(e);
    expect(md).toContain(e.titulo);
    expect(md).toContain(e.malEjemplo);
    expect(md).toContain(e.bienEjemplo);
    expect(md).toContain(e.wcag.url);
    expect(md).toContain("Ver explicación completa");
    expect(md).toContain(explanationCommandUri(e.ruleId));
  });

  it("el URI del comando lleva el ruleId codificado", () => {
    const uri = explanationCommandUri("jsx-a11y/alt-text");
    const args = JSON.parse(decodeURIComponent(uri.split("?")[1]!));
    expect(args).toEqual(["jsx-a11y/alt-text"]);
  });
});

describe("panel", () => {
  const html = renderPanelHtml(click, opts);

  it("tiene CSP estricta y ningún script", () => {
    expect(html).toContain("default-src 'none'");
    expect(html).toContain("style-src 'nonce-abc123'");
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/https?:\/\/[^"' ]*\.(js|css)/);
  });

  it("incluye el logo con texto alternativo y lang=es", () => {
    expect(html).toContain('alt="Logotipo de Lupa A11y"');
    expect(html).toContain('<html lang="es">');
  });

  it("muestra secciones, nivel como texto y enlaces", () => {
    expect(html).toContain("A quién afecta");
    expect(html).toContain("Por qué importa");
    expect(html).toContain("Nivel A");
    expect(html).toContain(click.wcag.url);
    expect(html).toContain(click.docsUrl!);
  });

  it("escapa el código de ejemplo (la nota con <button> no rompe el HTML)", () => {
    expect(html).toContain("&lt;button&gt;");
    expect(html).not.toContain("<button>");
  });
});

describe("highlightJsx", () => {
  it("escapa HTML y marca etiquetas, atributos y cadenas", () => {
    const out = highlightJsx(`<img src="a&b.png" onClick={x} />`);
    expect(out).toContain('<span class="tk-tag">img</span>');
    expect(out).toContain('<span class="tk-attr">src</span>');
    expect(out).toContain('<span class="tk-str">&quot;a&amp;b.png&quot;</span>');
    expect(out).not.toContain("<img");
  });

  it("escapeHtml neutraliza comillas y ángulos", () => {
    expect(escapeHtml(`<a href="x">`)).toBe("&lt;a href=&quot;x&quot;&gt;");
  });
});
