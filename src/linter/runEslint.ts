import html from "@html-eslint/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";
import { Linter } from "eslint";
import type { ESLint } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import * as vueParser from "vue-eslint-parser";
import { HTML_A11Y_RULES, flavorFor, isA11yRule } from "./flavors";
import { maskTemplate } from "./templates";

export { flavorFor, isA11yRule, SUPPORTED_LANGUAGES } from "./flavors";
export type { Flavor } from "./flavors";

export interface LintMessage {
  ruleId: string;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}

const linter = new Linter({ configType: "flat" });

/** Palabras redundantes en el alt (español + las inglesas por defecto). */
const REDUNDANT_ALT_WORDS = ["imagen", "foto", "fotografía", "fotografia"];

/** Textos de enlace ambiguos. `words` reemplaza la lista por defecto (en inglés). */
const AMBIGUOUS_LINK_WORDS = [
  "click here",
  "here",
  "link",
  "a link",
  "learn more",
  "clic aquí",
  "haz clic aquí",
  "aquí",
  "enlace",
  "un enlace",
  "más información",
  "leer más",
  "ver más",
  "más",
];

/** Preset JSX (React, Preact, Solid, Qwik…): solo reglas jsx-a11y/*. */
function jsxRules(): Linter.RulesRecord {
  const rules: Linter.RulesRecord = {};
  for (const [id, entry] of Object.entries(jsxA11y.flatConfigs.recommended.rules ?? {})) {
    if (id.startsWith("jsx-a11y/") && entry !== undefined) rules[id] = entry;
  }
  rules["jsx-a11y/img-redundant-alt"] = ["error", { words: REDUNDANT_ALT_WORDS }];
  // Reglas útiles que `recommended` no activa.
  rules["jsx-a11y/anchor-ambiguous-text"] = ["error", { words: AMBIGUOUS_LINK_WORDS }];
  rules["jsx-a11y/lang"] = "error";
  rules["jsx-a11y/no-aria-hidden-on-focusable"] = "error";
  const controlLabel =
    jsxA11y.flatConfigs.recommended.rules?.["jsx-a11y/control-has-associated-label"];
  if (Array.isArray(controlLabel)) {
    rules["jsx-a11y/control-has-associated-label"] = ["error", ...controlLabel.slice(1)];
  }
  return rules;
}

/** Preset Vue: todas las reglas vigentes de vuejs-accessibility. */
function vueRules(): Linter.RulesRecord {
  const rules: Linter.RulesRecord = {};
  for (const [name, rule] of Object.entries(vueA11y.rules ?? {})) {
    if ((rule as { meta?: { deprecated?: boolean } }).meta?.deprecated) continue;
    // `no-onchange` está obsoleta (los navegadores ya no tienen ese problema).
    if (name === "no-onchange") continue;
    rules[`vuejs-accessibility/${name}`] = "error";
  }
  // Por defecto exige anidar el campo *y* usar for/id; como en el preset JSX,
  // basta con una de las dos.
  rules["vuejs-accessibility/label-has-for"] = ["error", { required: { some: ["nesting", "id"] } }];
  return rules;
}

function htmlRules(): Linter.RulesRecord {
  return Object.fromEntries(HTML_A11Y_RULES.map((r) => [`@html-eslint/${r}`, "error"]));
}

const shared = { linterOptions: { reportUnusedDisableDirectives: "off" as const } };

const CONFIGS: Record<"jsx" | "vue" | "html", Linter.Config[]> = {
  jsx: [
    {
      ...shared,
      files: ["**/*.jsx", "**/*.tsx"],
      plugins: { "jsx-a11y": jsxA11y },
      languageOptions: {
        parser: tsParser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      rules: jsxRules(),
    },
  ],
  vue: [
    {
      ...shared,
      files: ["**/*.vue"],
      plugins: { "vuejs-accessibility": vueA11y as unknown as ESLint.Plugin },
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          parser: tsParser,
          ecmaVersion: "latest",
          sourceType: "module",
          ecmaFeatures: { jsx: true },
        },
      },
      rules: vueRules(),
    },
  ],
  // Svelte y Astro se normalizan a HTML (ver templates.ts) y usan el preset `html`.
  html: [
    {
      ...shared,
      files: ["**/*.html"],
      plugins: { "@html-eslint": html as unknown as ESLint.Plugin },
      language: "@html-eslint/html",
      rules: htmlRules(),
    },
  ],
};

/**
 * Conserva solo los mensajes de reglas de accesibilidad. Los errores de
 * sintaxis (mensajes fatales) se ignoran en silencio y devuelven lista vacía.
 */
export function toLintMessages(messages: readonly Linter.LintMessage[]): LintMessage[] {
  if (messages.some((m) => m.fatal)) return [];
  const out: LintMessage[] = [];
  for (const m of messages) {
    if (!m.ruleId || !isA11yRule(m.ruleId)) continue;
    out.push({
      ruleId: m.ruleId,
      message: m.message,
      line: m.line,
      column: m.column,
      endLine: m.endLine,
      endColumn: m.endColumn,
    });
  }
  return out;
}

/**
 * Nombre virtual para el Linter en memoria: solo importa la extensión (debe
 * coincidir con `files` del preset). Se deduce del idioma del editor y no del
 * nombre real, que puede ser "Untitled-1" o un `.js` con JSX.
 */
export function virtualFilename(filename: string, languageId?: string): string {
  if (languageId === "javascriptreact" || languageId === "javascript") return "file.jsx";
  if (languageId === "typescriptreact") return "file.tsx";
  const flavor = flavorFor(filename, languageId);
  if (flavor === "vue") return "file.vue";
  if (flavor && flavor !== "jsx") return "file.html";
  return /\.(jsx|js|mjs|cjs)$/i.test(filename) ? "file.jsx" : "file.tsx";
}

/** Analiza el texto con el preset incluido que corresponde a su framework. */
export function runEslint(text: string, filename: string, languageId?: string): LintMessage[] {
  const flavor = flavorFor(filename, languageId) ?? "jsx";
  const markup = flavor === "svelte" || flavor === "astro" || flavor === "html";
  const input = markup ? maskTemplate(text, flavor) : text;
  const config = markup ? CONFIGS.html : CONFIGS[flavor];
  return toLintMessages(
    linter.verify(input, config, { filename: virtualFilename(filename, languageId) }),
  );
}
