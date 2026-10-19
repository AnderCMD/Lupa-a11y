import { altText } from "./es/alt-text";
import { anchorHasContent } from "./es/anchor-has-content";
import { anchorIsValid } from "./es/anchor-is-valid";
import { ariaProps } from "./es/aria-props";
import { ariaRole } from "./es/aria-role";
import { clickEventsHaveKeyEvents } from "./es/click-events-have-key-events";
import { controlHasAssociatedLabel } from "./es/control-has-associated-label";
import { headingHasContent } from "./es/heading-has-content";
import { htmlHasLang } from "./es/html-has-lang";
import { iframeHasTitle } from "./es/iframe-has-title";
import { imgRedundantAlt } from "./es/img-redundant-alt";
import { interactiveSupportsFocus } from "./es/interactive-supports-focus";
import { labelHasAssociatedControl } from "./es/label-has-associated-control";
import { mediaHasCaption } from "./es/media-has-caption";
import { noAutofocus } from "./es/no-autofocus";
import { noStaticElementInteractions } from "./es/no-static-element-interactions";
import { roleHasRequiredAriaProps } from "./es/role-has-required-aria-props";
import { tabindexNoPositive } from "./es/tabindex-no-positive";
import { anchorAmbiguousText } from "./es/anchor-ambiguous-text";
import { ariaActivedescendantHasTabindex } from "./es/aria-activedescendant-has-tabindex";
import { ariaProptypes } from "./es/aria-proptypes";
import { ariaUnsupportedElements } from "./es/aria-unsupported-elements";
import { autocompleteValid } from "./es/autocomplete-valid";
import { lang } from "./es/lang";
import { mouseEventsHaveKeyEvents } from "./es/mouse-events-have-key-events";
import { noAccessKey } from "./es/no-access-key";
import { noAriaHiddenOnFocusable } from "./es/no-aria-hidden-on-focusable";
import { noDistractingElements } from "./es/no-distracting-elements";
import { noInteractiveElementToNoninteractiveRole } from "./es/no-interactive-element-to-noninteractive-role";
import { noNoninteractiveElementInteractions } from "./es/no-noninteractive-element-interactions";
import { noNoninteractiveElementToInteractiveRole } from "./es/no-noninteractive-element-to-interactive-role";
import { noNoninteractiveTabindex } from "./es/no-noninteractive-tabindex";
import { noRedundantRoles } from "./es/no-redundant-roles";
import { roleSupportsAriaProps } from "./es/role-supports-aria-props";
import { scope } from "./es/scope";
import { PENDING_RULES } from "./pending";
import type { RuleExplanation } from "./types";

export type { RuleExplanation } from "./types";

/**
 * Registro por idioma. Para añadir un idioma: crear `src/i18n/<idioma>/`
 * y registrarlo aquí; la lógica del linter no cambia.
 */
const registry: Record<string, readonly RuleExplanation[]> = {
  es: [
    altText,
    anchorIsValid,
    anchorHasContent,
    clickEventsHaveKeyEvents,
    noStaticElementInteractions,
    interactiveSupportsFocus,
    labelHasAssociatedControl,
    controlHasAssociatedLabel,
    ariaProps,
    ariaRole,
    roleHasRequiredAriaProps,
    headingHasContent,
    htmlHasLang,
    imgRedundantAlt,
    noAutofocus,
    tabindexNoPositive,
    mediaHasCaption,
    iframeHasTitle,
    anchorAmbiguousText,
    ariaActivedescendantHasTabindex,
    ariaProptypes,
    ariaUnsupportedElements,
    autocompleteValid,
    lang,
    mouseEventsHaveKeyEvents,
    noAccessKey,
    noAriaHiddenOnFocusable,
    noDistractingElements,
    noInteractiveElementToNoninteractiveRole,
    noNoninteractiveElementInteractions,
    noNoninteractiveElementToInteractiveRole,
    noNoninteractiveTabindex,
    noRedundantRoles,
    roleSupportsAriaProps,
    scope,
  ],
};

const DEFAULT_LOCALE = "es";

export function listExplanations(locale: string = DEFAULT_LOCALE): readonly RuleExplanation[] {
  return registry[locale] ?? registry[DEFAULT_LOCALE] ?? [];
}

export function getExplanation(
  ruleId: string,
  locale: string = DEFAULT_LOCALE,
): RuleExplanation | undefined {
  return listExplanations(locale).find((r) => r.ruleId === ruleId);
}

/** Reglas de jsx-a11y que aún no tienen traducción (usan el mensaje original). */
export function isPending(ruleId: string): boolean {
  return PENDING_RULES.includes(ruleId);
}

export function docsUrlFor(ruleId: string): string {
  const name = ruleId.replace(/^jsx-a11y\//, "");
  return `https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/${name}.md`;
}
