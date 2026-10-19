import { describe, expect, it } from "vitest";
import { extractNotes, isPrerelease, isValidVersion, promoteUnreleased } from "../scripts/release";

const CHANGELOG = `# Changelog

## [Sin publicar]

### Añadido

- Algo nuevo.

## [0.1.0] - 2026-01-01

### Añadido

- Primera versión.

## [0.0.9] - 2025-12-01

- Vieja.
`;

describe("release", () => {
  it("valida versiones semver", () => {
    expect(isValidVersion("1.2.3")).toBe(true);
    expect(isValidVersion("1.2.3-beta.1")).toBe(true);
    expect(isValidVersion("v1.2.3")).toBe(false);
    expect(isValidVersion("1.2")).toBe(false);
    expect(isPrerelease("1.2.3-beta.1")).toBe(true);
    expect(isPrerelease("1.2.3")).toBe(false);
  });

  it("extrae las notas de una versión sin invadir las vecinas", () => {
    expect(extractNotes(CHANGELOG, "0.1.0")).toBe("### Añadido\n\n- Primera versión.");
    expect(extractNotes(CHANGELOG, "0.0.9")).toBe("- Vieja.");
    expect(extractNotes(CHANGELOG, "9.9.9")).toBeUndefined();
  });

  it("promueve 'Sin publicar' y deja una sección vacía", () => {
    const out = promoteUnreleased(CHANGELOG, "0.2.0", "2026-02-02");
    expect(out).toContain(
      "## [Sin publicar]\n\n## [0.2.0] - 2026-02-02\n\n### Añadido\n\n- Algo nuevo.",
    );
    expect(extractNotes(out, "0.2.0")).toBe("### Añadido\n\n- Algo nuevo.");
    expect(extractNotes(out, "Sin publicar")).toBeUndefined();
  });

  it("falla si no existe 'Sin publicar'", () => {
    expect(() => promoteUnreleased("# x", "1.0.0", "2026-01-01")).toThrow();
  });
});
