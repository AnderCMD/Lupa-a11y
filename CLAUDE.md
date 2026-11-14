# Lupa A11y: reglas para agentes

Extensión de VS Code y librería (`lupa-a11y-core`) que analiza la accesibilidad de JSX/TSX, Vue, Svelte, Astro, Angular y HTML y la explica en español. Todo el texto de cara a la persona usuaria, los commits y la documentación van en **español neutro, con tuteo**.

## Ramas (ver docs/flujo-de-trabajo.md)

- `main` es producción: **nunca** commits directos. Solo PR desde `dev` o `hotfix/*`, con merge commit.
- El PR a `main` exige los checks `build` y `origen-permitido` y que `dev` esté al día con `main`; si no lo está, `git merge origin/main` en `dev`.
- Auto-merge está desactivado: se mezcla a mano con `gh pr merge --merge` cuando la CI está en verde.
- El trabajo nuevo va en `feature/*`, `fix/*`, `traduccion/*` o `docs/*` desde `dev`.
- Una versión sale así: `npm run release:prepare -- X.Y.Z` en `dev` → PR a `main` → merge → `git tag vX.Y.Z` en `main` → push de la etiqueta. Publica en GitHub Releases, Marketplace y npm; el environment `production` espera la aprobación de la persona mantenedora.
- No crees etiquetas, no publiques y no mezcles en `main` sin que la persona lo pida.

## Antes de dar algo por terminado

```bash
npm run lint && npm run format:check && npm run typecheck && npm test && npm run check:translations && npm run build
```

Si tocas el empaquetado, la activación o la UI: `npm run test:integration` (VS Code real). Si tocas `src/lib.ts`, `src/cli.ts` o dependencias: `npm run build:lib && npm run smoke:lib`.

## Arquitectura

`src/linter/flavors.ts` (familia por idioma o extensión) → `templates.ts` (normaliza Svelte/Astro/Angular) → `runEslint.ts` (presets) o `projectEslint.ts` (config del proyecto) → `mapDiagnostics.ts` (traduce con `src/i18n/`, resolviendo `aliases.ts`) → `extension.ts` o `cli.ts`. Quick fixes en `src/fixes/` (JSX con AST, plantillas en `markup.ts`). Nada fuera de `extension.ts`, `config.ts` y `src/ui/` puede importar `vscode`.

## Reglas que no se negocian

- Los quick fixes **nunca inventan contenido** que requiere criterio humano (descripciones, textos visibles).
- `templates.ts` **no puede cambiar la longitud ni los saltos de línea** del texto.
- Cada explicación nueva necesita fixture o caso en `test/frameworks.test.ts`; cada regla equivalente usa un alias en vez de duplicar textos. `mensaje` ≤ 90 caracteres, criterio WCAG 2.2 verificado en w3.org.
- La config de ESLint del proyecto es código: solo se ejecuta en workspaces de confianza.
- Sin telemetría ni llamadas de red.
- Nuevas dependencias del bundle: comprueba que el `.vsix` funciona sin `node_modules` (`test/bundle.test.ts`) y añade los ajustes de esbuild en `scripts/esbuild-shared.mjs`.
- No migrar el motor a Rust/Go sin revisar [ADR 0001](docs/adr/0001-motor-en-javascript-no-rust-ni-go.md).
- Cambios visibles → entrada en `CHANGELOG.md` bajo "Sin publicar".

## Grafo de conocimiento

`graphify-out/` tiene el grafo del repositorio (`GRAPH_REPORT.md`, `graph.json`, `graph.html`). Para preguntas de arquitectura, consúltalo primero (`graphify query "..."`) y regenéralo con `/graphify . --update` tras cambios grandes.
