import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getExplanation } from "../src/i18n";
import { mapMessages } from "../src/linter/mapDiagnostics";
import { runEslint } from "../src/linter/runEslint";

const RULES = [
  "alt-text",
  "anchor-is-valid",
  "anchor-has-content",
  "click-events-have-key-events",
  "no-static-element-interactions",
  "interactive-supports-focus",
  "label-has-associated-control",
  "control-has-associated-label",
  "aria-props",
  "aria-role",
  "role-has-required-aria-props",
  "heading-has-content",
  "html-has-lang",
  "img-redundant-alt",
  "no-autofocus",
  "tabindex-no-positive",
  "media-has-caption",
  "iframe-has-title",
];

function lintFixture(rule: string, name: "malo" | "bueno") {
  const file = join(__dirname, "fixtures", rule, `${name}.tsx`);
  return mapMessages(runEslint(readFileSync(file, "utf8"), `${name}.tsx`));
}

describe.each(RULES)("fixtures de %s", (rule) => {
  const ruleId = `jsx-a11y/${rule}`;

  it("malo.tsx produce el diagnóstico en español", () => {
    const found = lintFixture(rule, "malo").filter((d) => d.ruleId === ruleId);
    expect(found).toHaveLength(1);
    expect(found[0]?.message).toBe(getExplanation(ruleId)?.mensaje);
    expect(found[0]?.translated).toBe(true);
  });

  it("bueno.tsx no produce diagnósticos", () => {
    expect(lintFixture(rule, "bueno")).toEqual([]);
  });
});
