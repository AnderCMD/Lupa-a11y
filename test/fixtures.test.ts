import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getExplanation, listExplanations } from "../src/i18n";
import { mapMessages } from "../src/linter/mapDiagnostics";
import { runEslint } from "../src/linter/runEslint";

// Cada carpeta de test/fixtures es una regla traducida (ver también i18n.test.ts).
const RULES = readdirSync(join(__dirname, "fixtures")).sort();

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

describe("cobertura de fixtures", () => {
  it("hay fixtures para todas las reglas traducidas y solo para ellas", () => {
    const translated = listExplanations("es")
      .map((t) => t.ruleId.replace("jsx-a11y/", ""))
      .sort();
    expect(RULES).toEqual(translated);
  });
});
