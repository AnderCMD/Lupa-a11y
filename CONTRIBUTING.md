# Cómo contribuir a Lupa A11y

¡Gracias por ayudar! El valor de este proyecto está en la **calidad de los textos en español**, así que las mejores contribuciones son traducciones nuevas o mejoras a las existentes.

## Ramas y PR

`main` es producción y `dev` es desarrollo. Crea tu rama desde `dev` y abre el PR **a `dev`**; `main` solo recibe PR desde `dev` (o `hotfix/*`). Detalles y reglas configuradas en GitHub: [docs/flujo-de-trabajo.md](docs/flujo-de-trabajo.md).

Nombres de rama: `feature/*` (funciones), `fix/*` (errores), `traduccion/*` (textos), `docs/*` (documentación) y `hotfix/*` (urgencias que van directas a `main`). Commits en español, en imperativo o como resumen corto del cambio.

## Preparar el entorno

Necesitas Node 22 o superior.

```bash
npm install
npm run build
npm test
```

Para probar la extensión: abre la carpeta en VS Code y pulsa **F5** (configuración "Ejecutar la extensión"), o ejecuta los tests de integración:

```bash
npm run test:integration
```

Sin configurar nada, `@vscode/test-electron` descarga una copia de VS Code. Si prefieres usar la tuya: `VSCODE_TEST_EXECUTABLE="/ruta/a/Code" npm run test:integration`.

| Comando                           | Qué hace                                                            |
| --------------------------------- | ------------------------------------------------------------------- |
| `npm test`                        | Tests unitarios (Vitest)                                            |
| `npm run lint` / `format:check`   | ESLint y Prettier del proyecto                                      |
| `npm run typecheck`               | TypeScript en modo estricto                                         |
| `npm run check:translations`      | Falla si una regla activa no tiene explicación (propia o por alias) |
| `npm run bench`                   | Mide el tiempo de análisis por framework (~500 líneas)              |
| `npm run a11y -- <rutas>`         | Ejecuta la CLI sobre tus archivos                                   |
| `npm run build:lib` / `smoke:lib` | Construye y prueba la librería `lupa-a11y-core`                     |
| `npm run build:brand`             | Regenera logotipo y PNG de `assets/brand/`                          |
| `npm run package`                 | Genera el `.vsix`                                                   |

## Añadir o mejorar la traducción de una regla

1. Mira qué reglas faltan en [`src/i18n/pending.ts`](src/i18n/pending.ts) (hoy son 4: tres obsoletas y una opinionada) o propón mejoras a una traducción existente.
2. Crea `src/i18n/es/<nombre-de-la-regla>.ts` con la plantilla de abajo.
3. Regístrala en [`src/i18n/index.ts`](src/i18n/index.ts) y **quítala de `pending.ts`**.
4. Crea `test/fixtures/<regla>/malo.tsx` (debe producir exactamente ese diagnóstico) y `bueno.tsx` (no debe producir ninguno). `test/fixtures.test.ts` recorre la carpeta solo y falla si falta alguna.
5. Si la regla tiene configuración que no entiende el español (como `img-redundant-alt`), ajústala en `src/linter/runEslint.ts`.
6. Ejecuta `npm test` y `npm run check:translations`.

### Reglas de Vue y HTML (Svelte, Astro, Angular)

- Si la regla equivale a una que ya tiene explicación (por ejemplo, `vuejs-accessibility/alt-text` → `jsx-a11y/alt-text`), no escribas otra: añade el alias en [`src/i18n/aliases.ts`](src/i18n/aliases.ts).
- Si no, crea su explicación igual que arriba, con el `ruleId` real (`@html-eslint/...` o `vuejs-accessibility/...`) y ejemplos en HTML.
- Las reglas de `@html-eslint` que se activan están en `HTML_A11Y_RULES` de [`src/linter/flavors.ts`](src/linter/flavors.ts).
- Añade un caso malo/bueno en [`test/frameworks.test.ts`](test/frameworks.test.ts); un test comprueba que ninguna regla ni alias se queda sin caso.
- Si tocas la normalización de plantillas ([`src/linter/templates.ts`](src/linter/templates.ts)), recuerda que **no puede cambiar la longitud ni los saltos de línea**: las posiciones de los diagnósticos dependen de ello.

Verifica el criterio WCAG contra la [documentación oficial de WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/) antes de fijarlo; no copies el del plugin sin comprobarlo.

### Plantilla

```ts
import type { RuleExplanation } from "../types";

export const nombreDeLaRegla: RuleExplanation = {
  ruleId: "jsx-a11y/nombre-de-la-regla",
  titulo: "Título corto del problema",
  mensaje: "Una línea accionable para el panel Problems (máx. 90 caracteres).",
  porQueImporta: "Máximo dos frases, centradas en la persona afectada.",
  afectados: ["Personas que usan lector de pantalla"],
  malEjemplo: `<img src="/grafica-ventas.png" />`,
  bienEjemplo: `<img src="/grafica-ventas.png" alt="Gráfica de barras: las ventas subieron 20%" />`,
  notaExtra: "Excepciones y matices reales (opcional).",
  wcag: {
    criterio: "1.1.1 Contenido no textual",
    nivel: "A", // "A" | "AA" | "AAA" | "buena práctica"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  },
  docsUrl:
    "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/nombre-de-la-regla.md",
};
```

### Guía de estilo para los textos

- Español neutro latinoamericano. Tuteo ("usa", "agrega"); nunca "usted" ni voseo.
- Nada de traducción literal del inglés: explica con palabras que usaría una persona desarrolladora hispanohablante.
- Sin jerga innecesaria. Si usas un término técnico (ARIA, rol, foco), explícalo la primera vez en una frase.
- `mensaje`: una sola línea, accionable, sin tono de regaño.
- `porQueImporta`: máximo dos frases, centradas en la persona afectada, no en el cumplimiento legal.
- Ejemplos de código realistas (nada de `foo`/`bar`), con textos visibles en español.
- Prioriza siempre la solución semántica (usar el elemento correcto) antes que parches con ARIA.
- Menciona las excepciones reales cuando existan (por ejemplo, las imágenes decorativas).

## Quick fixes

Regla de oro: **nunca inventar contenido que requiere criterio humano**. Un quick fix puede mover, quitar o añadir atributos deterministas, pero no escribir descripciones ni textos visibles por su cuenta. Los fixes son funciones puras en `src/fixes/` (sin `vscode`); sus tests aplican el fix y vuelven a analizar el resultado para comprobar que el problema desaparece. Los de JSX trabajan sobre el AST; los de Vue/HTML/Svelte/Astro, sobre la etiqueta de apertura ([`src/fixes/markup.ts`](src/fixes/markup.ts)) y se prueban en `test/markupFixes.test.ts`.

## Arquitectura en una frase

`flavors.ts` decide la familia por idioma o extensión → `templates.ts` normaliza Svelte/Astro/Angular → `runEslint.ts` ejecuta el preset (o `projectEslint.ts` la config del proyecto) → `mapDiagnostics.ts` traduce con `i18n/` (resolviendo alias) → la extensión (`extension.ts`) o la CLI (`cli.ts`) lo muestran. Por qué el motor sigue en JavaScript: [ADR 0001](docs/adr/0001-motor-en-javascript-no-rust-ni-go.md).

## Idiomas

`src/i18n/<idioma>/` y el registro de `src/i18n/index.ts` están preparados para más idiomas, pero la v1 solo incluye español y no tiene selector de idioma. Abre un issue antes de empezar una traducción completa.

## Marca

El logotipo se genera con `npm run build:brand` (no edites los PNG a mano). Detalles en [assets/brand/README.md](assets/brand/README.md).

## Publicar (solo mantenedores)

Automático al etiquetar `vX.Y.Z` en `main`: ver [docs/flujo-de-trabajo.md](docs/flujo-de-trabajo.md).
