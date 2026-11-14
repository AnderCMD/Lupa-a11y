/**
 * Reglas de otros plugins (Vue, HTML/Svelte/Astro/Angular) que equivalen a una
 * explicación ya escrita. El diagnóstico conserva el id real de la regla (para
 * `ignoreRules` y los enlaces a su documentación); la explicación se comparte.
 */
const VUE_SAME_NAME = [
  "alt-text",
  "anchor-has-content",
  "aria-props",
  "aria-role",
  "aria-unsupported-elements",
  "click-events-have-key-events",
  "heading-has-content",
  "iframe-has-title",
  "interactive-supports-focus",
  "media-has-caption",
  "mouse-events-have-key-events",
  "no-access-key",
  "no-aria-hidden-on-focusable",
  "no-autofocus",
  "no-distracting-elements",
  "no-redundant-roles",
  "no-static-element-interactions",
  "role-has-required-aria-props",
  "tabindex-no-positive",
];

export const ALIASES: Readonly<Record<string, string>> = {
  ...Object.fromEntries(VUE_SAME_NAME.map((r) => [`vuejs-accessibility/${r}`, `jsx-a11y/${r}`])),
  "vuejs-accessibility/label-has-for": "jsx-a11y/label-has-associated-control",
  "@html-eslint/require-img-alt": "jsx-a11y/alt-text",
  "@html-eslint/require-frame-title": "jsx-a11y/iframe-has-title",
  "@html-eslint/no-positive-tabindex": "jsx-a11y/tabindex-no-positive",
  "@html-eslint/no-accesskey-attrs": "jsx-a11y/no-access-key",
  "@html-eslint/no-invalid-role": "jsx-a11y/aria-role",
  "@html-eslint/no-aria-hidden-on-focusable": "jsx-a11y/no-aria-hidden-on-focusable",
  "@html-eslint/no-redundant-role": "jsx-a11y/no-redundant-roles",
  "@html-eslint/no-empty-headings": "jsx-a11y/heading-has-content",
  "@html-eslint/require-lang": "jsx-a11y/html-has-lang",
  "@html-eslint/require-input-label": "vuejs-accessibility/form-control-has-label",
};

/** Id de la explicación que corresponde a `ruleId` (él mismo si no es un alias). */
export function canonicalRuleId(ruleId: string): string {
  return ALIASES[ruleId] ?? ruleId;
}
