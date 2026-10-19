import { describe, expect, it } from "vitest";
import { applyEdits, getFixes } from "../src/fixes";
import { stripRedundantLead } from "../src/fixes/imgRedundantAlt";
import { runEslint } from "../src/linter/runEslint";

function offsetAt(text: string, line: number, column: number): number {
  const lines = text.split("\n");
  let offset = 0;
  for (let i = 0; i < line - 1; i++) offset += (lines[i]?.length ?? 0) + 1;
  return offset + column - 1;
}

/** Devuelve los fixes de la primera aparición de `ruleId` en `code`. */
function fixesFor(ruleId: string, code: string) {
  const msg = runEslint(code, "a.tsx").find((m) => m.ruleId === ruleId);
  expect(msg, `${ruleId} debe dispararse`).toBeDefined();
  return getFixes(ruleId, code, offsetAt(code, msg!.line, msg!.column));
}

/** Aplica el fix y comprueba que la regla ya no se dispara ni aparecen otras nuevas. */
function expectFixResolves(ruleId: string, code: string, title: string): string {
  const fix = fixesFor(ruleId, code).find((f) => f.title === title);
  expect(fix, `falta el fix "${title}"`).toBeDefined();
  const result = applyEdits(code, fix!.edits);
  const before = runEslint(code, "a.tsx").map((m) => m.ruleId);
  const after = runEslint(result, "a.tsx").map((m) => m.ruleId);
  expect(after).not.toContain(ruleId);
  expect(after.length).toBeLessThan(before.length);
  return result;
}

describe("alt-text", () => {
  const code = `const a = <img src="/x.png" />;`;

  it("marca como decorativa con alt vacío", () => {
    expect(
      expectFixResolves("jsx-a11y/alt-text", code, 'Marcar la imagen como decorativa (alt="")'),
    ).toBe(`const a = <img src="/x.png" alt="" />;`);
  });

  it("deja un TODO visible, sin describir la imagen", () => {
    const out = expectFixResolves(
      "jsx-a11y/alt-text",
      code,
      'Agregar alt="TODO: describe lo que muestra"',
    );
    expect(out).toContain('alt="TODO: describe lo que muestra"');
  });

  it("ofrece solo estas dos opciones (nunca una descripción inventada)", () => {
    expect(fixesFor("jsx-a11y/alt-text", code).map((f) => f.title)).toEqual([
      'Marcar la imagen como decorativa (alt="")',
      'Agregar alt="TODO: describe lo que muestra"',
    ]);
  });

  it("inserta bien en etiquetas sin atributos y multilínea", () => {
    expect(
      applyEdits(
        "const a = <img />;",
        fixesFor("jsx-a11y/alt-text", "const a = <img />;")[0]!.edits,
      ),
    ).toBe('const a = <img alt="" />;');
  });

  it("no ofrece fix para otros elementos ni con spread", () => {
    expect(fixesFor("jsx-a11y/alt-text", `const a = <input type="image" />;`)).toEqual([]);
    const spread = `const a = <img {...props} />;`;
    const msg = runEslint(spread, "a.tsx").find((m) => m.ruleId === "jsx-a11y/alt-text");
    if (msg)
      expect(getFixes("jsx-a11y/alt-text", spread, offsetAt(spread, msg.line, msg.column))).toEqual(
        [],
      );
  });
});

describe("click-events-have-key-events / no-static-element-interactions", () => {
  const code = `const a = <div onClick={abrirMenu}>Menú</div>;`;

  it.each(["jsx-a11y/click-events-have-key-events", "jsx-a11y/no-static-element-interactions"])(
    "convierte en <button> (%s)",
    (rule) => {
      const out = expectFixResolves(rule, code, "Convertir en <button>");
      expect(out).toBe(`const a = <button type="button" onClick={abrirMenu}>Menú</button>;`);
    },
  );

  it("la alternativa agrega role, tabIndex y onKeyDown que dispara el mismo clic", () => {
    const out = expectFixResolves(
      "jsx-a11y/click-events-have-key-events",
      code,
      "Agregar role, tabIndex y onKeyDown (Enter y Espacio)",
    );
    expect(out).toContain('role="button"');
    expect(out).toContain("tabIndex={0}");
    expect(out).toContain("e.currentTarget.click()");
    expect(runEslint(out, "a.tsx")).toEqual([]);
  });

  it("también convierte <span> y conserva los demás atributos", () => {
    const out = expectFixResolves(
      "jsx-a11y/click-events-have-key-events",
      `const a = <span className="x" onClick={f}>Hola <b>tú</b></span>;`,
      "Convertir en <button>",
    );
    expect(out).toBe(
      `const a = <button type="button" className="x" onClick={f}>Hola <b>tú</b></button>;`,
    );
  });

  it("no convierte en <button> si hay contenido de bloque o ya hay role", () => {
    const block = `const a = <div onClick={f}><div>Hola</div></div>;`;
    expect(
      fixesFor("jsx-a11y/click-events-have-key-events", block).map((f) => f.title),
    ).not.toContain("Convertir en <button>");
    const withRole = `const a = <div role="link" onClick={f}>Hola</div>;`;
    expect(
      fixesFor("jsx-a11y/click-events-have-key-events", withRole).map((f) => f.title),
    ).not.toContain("Convertir en <button>");
  });

  it("no ofrece nada si ya hay onKeyDown y tabIndex y no es convertible", () => {
    const code2 = `const a = <div onClick={f} onKeyDown={g} tabIndex={0}><div>x</div></div>;`;
    const msgs = runEslint(code2, "a.tsx").filter(
      (m) => m.ruleId === "jsx-a11y/no-static-element-interactions",
    );
    for (const m of msgs) {
      expect(getFixes(m.ruleId, code2, offsetAt(code2, m.line, m.column))).toEqual([]);
    }
  });
});

describe("html-has-lang", () => {
  it('agrega lang="es"', () => {
    const out = expectFixResolves(
      "jsx-a11y/html-has-lang",
      `const a = <html><body /></html>;`,
      'Agregar lang="es" a <html>',
    );
    expect(out).toBe(`const a = <html lang="es"><body /></html>;`);
  });
});

describe("img-redundant-alt", () => {
  it("quita la frase redundante y lo muestra en el título", () => {
    const code = `const a = <img src="/g.jpg" alt="Imagen de un gato durmiendo" />;`;
    const fixes = fixesFor("jsx-a11y/img-redundant-alt", code);
    expect(fixes[0]?.title).toBe('Cambiar alt a "Un gato durmiendo"');
    const out = expectFixResolves("jsx-a11y/img-redundant-alt", code, fixes[0]!.title);
    expect(out).toBe(`const a = <img src="/g.jpg" alt="Un gato durmiendo" />;`);
  });

  it("stripRedundantLead solo toca el inicio", () => {
    expect(stripRedundantLead("Foto de perfil de Ana")).toBe("Perfil de Ana");
    expect(stripRedundantLead("Fotografía del equipo")).toBe("Equipo");
    expect(stripRedundantLead("Un gato (foto)")).toBeUndefined();
    expect(stripRedundantLead("Foto")).toBeUndefined();
  });
});

describe("tabindex-no-positive", () => {
  it("reemplaza por tabIndex={0}", () => {
    const out = expectFixResolves(
      "jsx-a11y/tabindex-no-positive",
      `const a = <button type="button" tabIndex={3}>Ok</button>;`,
      "Reemplazar por tabIndex={0}",
    );
    expect(out).toBe(`const a = <button type="button" tabIndex={0}>Ok</button>;`);
  });
});

describe("no-autofocus", () => {
  it("quita el atributo sin dejar huecos", () => {
    const out = expectFixResolves(
      "jsx-a11y/no-autofocus",
      `const a = <input type="text" autoFocus />;`,
      "Quitar autoFocus",
    );
    expect(out).toBe(`const a = <input type="text" />;`);
  });

  it("funciona con atributos en líneas separadas", () => {
    const code = `const a = (\n  <input\n    type="text"\n    autoFocus\n  />\n);`;
    expect(expectFixResolves("jsx-a11y/no-autofocus", code, "Quitar autoFocus")).toBe(
      `const a = (\n  <input\n    type="text"\n  />\n);`,
    );
  });
});

describe("seguridad", () => {
  it("reglas sin fix o código roto no ofrecen nada", () => {
    expect(getFixes("jsx-a11y/aria-role", `const a = <div role="boton" />;`, 10)).toEqual([]);
    expect(getFixes("jsx-a11y/alt-text", "const a = <img", 0)).toEqual([]);
  });
});
