# Cómo contribuir a Lupa A11y

¡Gracias por ayudar! El valor de este proyecto está en la **calidad de los textos en español**, así que las mejores contribuciones son traducciones nuevas o mejoras a las existentes.

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

| Comando                         | Qué hace                                                             |
| ------------------------------- | -------------------------------------------------------------------- |
| `npm test`                      | Tests unitarios (Vitest)                                             |
| `npm run lint` / `format:check` | ESLint y Prettier del proyecto                                       |
| `npm run typecheck`             | TypeScript en modo estricto                                          |
| `npm run check:translations`    | Falla si una regla del plugin no tiene traducción ni marca pendiente |
| `npm run bench`                 | Mide el tiempo de análisis de un archivo de ~500 líneas              |
| `npm run build:brand`           | Regenera logotipo y PNG de `assets/brand/`                           |
| `npm run package`               | Genera el `.vsix`                                                    |

## Añadir o mejorar la traducción de una regla

1. Mira qué reglas faltan en [`src/i18n/pending.ts`](src/i18n/pending.ts).
2. Crea `src/i18n/es/<nombre-de-la-regla>.ts` con la plantilla de abajo.
3. Regístrala en [`src/i18n/index.ts`](src/i18n/index.ts) y **quítala de `pending.ts`**.
4. Crea `test/fixtures/<regla>/malo.tsx` (debe producir exactamente ese diagnóstico) y `bueno.tsx` (no debe producir ninguno) y añade la regla a la lista de `test/fixtures.test.ts`.
5. Si la regla tiene configuración que no entiende el español (como `img-redundant-alt`), ajústala en `src/linter/runEslint.ts`.
6. Ejecuta `npm test` y `npm run check:translations`.

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

Regla de oro: **nunca inventar contenido que requiere criterio humano**. Un quick fix puede mover, quitar o añadir atributos deterministas, pero no escribir descripciones ni textos visibles por su cuenta. Los fixes son funciones puras en `src/fixes/` (sin `vscode`); sus tests aplican el fix y vuelven a analizar el resultado para comprobar que el problema desaparece.

## Idiomas

`src/i18n/<idioma>/` y el registro de `src/i18n/index.ts` están preparados para más idiomas, pero la v1 solo incluye español y no tiene selector de idioma. Abre un issue antes de empezar una traducción completa.

## Marca

El logotipo se genera con `npm run build:brand` (no edites los PNG a mano). Detalles en [assets/brand/README.md](assets/brand/README.md).

**Paso manual: imagen social del repositorio.** GitHub no permite subirla por API:

1. Repositorio → **Settings** → **General**.
2. Sección **Social preview** → **Edit** → **Upload an image**.
3. Elige `assets/brand/social-preview-1280x640.png`.

## Publicar (solo mantenedores)

Ver [docs/publicar.md](docs/publicar.md).
