import { describe, expect, it } from "vitest";
import { mapMessages } from "../src/linter/mapDiagnostics";
import { runEslint } from "../src/linter/runEslint";

describe("mapMessages", () => {
  it("convierte líneas y columnas de base 1 a base 0", () => {
    const [d] = mapMessages([
      {
        ruleId: "jsx-a11y/alt-text",
        message: "x",
        line: 3,
        column: 5,
        endLine: 3,
        endColumn: 20,
      },
    ]);
    expect(d).toMatchObject({
      startLine: 2,
      startCharacter: 4,
      endLine: 2,
      endCharacter: 19,
    });
  });

  it("sin traducción usa el mensaje original con sufijo", () => {
    const [d] = mapMessages([
      { ruleId: "jsx-a11y/no-onchange", message: "Original", line: 1, column: 1 },
    ]);
    expect(d?.message).toBe("Original (sin traducir)");
    expect(d?.translated).toBe(false);
    expect(d?.docsUrl).toContain("docs/rules/no-onchange.md");
  });

  it("respeta ignoreRules", () => {
    const out = mapMessages(
      [{ ruleId: "jsx-a11y/alt-text", message: "x", line: 1, column: 1 }],
      ["jsx-a11y/alt-text"],
    );
    expect(out).toEqual([]);
  });
});

describe("runEslint", () => {
  it("con sintaxis rota devuelve lista vacía sin lanzar", () => {
    expect(runEslint("const x = <img src=", "roto.tsx")).toEqual([]);
  });

  it("detecta <img> sin alt en una sola línea", () => {
    const msgs = runEslint('const a = <img src="x.png" />;', "a.tsx");
    expect(msgs.map((m) => m.ruleId)).toContain("jsx-a11y/alt-text");
  });
});

describe("runEslint con rutas absolutas", () => {
  it("analiza archivos fuera del directorio de trabajo", () => {
    const msgs = runEslint('const a = <img src="x.png" />;', "/otra/ruta/Foto.jsx");
    expect(msgs.map((m) => m.ruleId)).toContain("jsx-a11y/alt-text");
  });
});

describe("nombre virtual del archivo", () => {
  it("analiza documentos sin extensión usando el idioma del editor", () => {
    const code = 'const a = <img src="x.png" />;';
    expect(runEslint(code, "Untitled-1", "typescriptreact").map((m) => m.ruleId)).toContain(
      "jsx-a11y/alt-text",
    );
    expect(runEslint(code, "/p/componente.js", "javascriptreact").map((m) => m.ruleId)).toContain(
      "jsx-a11y/alt-text",
    );
  });
});
