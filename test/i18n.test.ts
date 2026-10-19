import { describe, expect, it } from "vitest";
import { getExplanation, isPending, listExplanations } from "../src/i18n";

const all = listExplanations("es");

describe("traducciones al español", () => {
  it("no tiene reglas duplicadas y cubre las 18 de la v1", () => {
    expect(new Set(all.map((t) => t.ruleId)).size).toBe(all.length);
    expect(all.length).toBeGreaterThanOrEqual(18);
  });

  it.each(all.map((t) => [t.ruleId, t] as const))("%s está completa", (_id, t) => {
    expect(t.mensaje.length).toBeLessThanOrEqual(90);
    expect(t.afectados.length).toBeGreaterThan(0);
    expect(t.wcag.url).toMatch(/^https:\/\/www\.w3\.org\/WAI\/WCAG22\//);
    expect(t.docsUrl).toContain(t.ruleId.replace("jsx-a11y/", ""));
    expect(t.malEjemplo).not.toBe(t.bienEjemplo);
  });

  it("una regla traducida no está marcada como pendiente", () => {
    for (const t of all) expect(isPending(t.ruleId)).toBe(false);
  });

  it("devuelve undefined para reglas sin traducción", () => {
    expect(getExplanation("jsx-a11y/no-onchange")).toBeUndefined();
    expect(isPending("jsx-a11y/no-onchange")).toBe(true);
  });
});
