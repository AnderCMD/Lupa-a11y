/**
 * Familias de sintaxis que Lupa A11y sabe analizar.
 *
 * - `jsx`: React, Next.js, Remix, Preact, Solid, Qwik… (`.jsx`, `.tsx` y `.js` con JSX).
 * - `vue`: componentes de un solo archivo (`.vue`), Nuxt incluido.
 * - `svelte`: `.svelte` (SvelteKit incluido).
 * - `astro`: `.astro`.
 * - `html`: `.html`, plantillas de Angular (`*.component.html`), Alpine, htmx, etc.
 */
export type Flavor = "jsx" | "vue" | "svelte" | "astro" | "html";

const BY_LANGUAGE: Record<string, Flavor> = {
  javascriptreact: "jsx",
  typescriptreact: "jsx",
  javascript: "jsx",
  vue: "vue",
  svelte: "svelte",
  astro: "astro",
  html: "html",
  // Extensión oficial de Angular.
  "angular-html": "html",
};

const BY_EXTENSION: Record<string, Flavor> = {
  jsx: "jsx",
  tsx: "jsx",
  js: "jsx",
  mjs: "jsx",
  cjs: "jsx",
  vue: "vue",
  svelte: "svelte",
  astro: "astro",
  html: "html",
  htm: "html",
};

/** Idiomas de VS Code admitidos (ver `lupaA11y.languages`). */
export const SUPPORTED_LANGUAGES: readonly string[] = Object.keys(BY_LANGUAGE);

/** Extensiones de archivo admitidas (para el análisis del workspace y la CLI). */
export const SUPPORTED_EXTENSIONS: readonly string[] = Object.keys(BY_EXTENSION);

/** Idioma de VS Code equivalente a una extensión (para respetar `lupaA11y.languages`). */
export function languageForPath(filename: string): string | undefined {
  const ext = /\.([a-z0-9]+)$/i.exec(filename)?.[1]?.toLowerCase();
  switch (ext) {
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "jsx":
      return "javascriptreact";
    case "tsx":
      return "typescriptreact";
    case "htm":
      return "html";
    default:
      return ext && BY_LANGUAGE[ext] ? ext : undefined;
  }
}

export function flavorFor(filename: string, languageId?: string): Flavor | undefined {
  if (languageId && BY_LANGUAGE[languageId]) return BY_LANGUAGE[languageId];
  const ext = /\.([a-z0-9]+)$/i.exec(filename)?.[1]?.toLowerCase();
  return ext ? BY_EXTENSION[ext] : undefined;
}

/** Prefijos de los plugins de accesibilidad cuyos mensajes se muestran. */
export const A11Y_PREFIXES: readonly string[] = [
  "jsx-a11y/",
  "vuejs-accessibility/",
  "@html-eslint/",
];

/** Reglas de @html-eslint que son de accesibilidad (el resto se descarta). */
export const HTML_A11Y_RULES: readonly string[] = [
  "require-img-alt",
  "require-frame-title",
  "no-positive-tabindex",
  "no-accesskey-attrs",
  "no-invalid-role",
  "no-abstract-roles",
  "no-aria-hidden-on-focusable",
  "no-aria-hidden-body",
  "no-redundant-role",
  "no-empty-headings",
  "no-skip-heading-levels",
  "no-heading-inside-button",
  "no-non-scalable-viewport",
  "require-input-label",
  "require-lang",
  "require-title",
];
const HTML_A11Y = new Set(HTML_A11Y_RULES);

export function isA11yRule(ruleId: string): boolean {
  if (ruleId.startsWith("@html-eslint/")) return HTML_A11Y.has(ruleId.slice(13));
  return A11Y_PREFIXES.some((p) => ruleId.startsWith(p));
}

/** Prefijo de plugin cuyas reglas deben aparecer en la config del proyecto para usarla. */
export function pluginPrefixFor(flavor: Flavor): string {
  if (flavor === "jsx") return "jsx-a11y/";
  if (flavor === "vue") return "vuejs-accessibility/";
  return "@html-eslint/";
}
