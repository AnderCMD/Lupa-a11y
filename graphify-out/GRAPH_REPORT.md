# Graph Report - .  (2026-11-14)

## Corpus Check
- 209 files · ~55,707 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 805 nodes · 1309 edges · 109 communities (102 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Explicaciones en español (i18n)
- Motor, CLI y benchmark
- Verificación de traducciones
- Contribuciones de VS Code
- Dependencias de desarrollo
- Quick fixes JSX (AST)
- Esquema de ajustes
- Generación de marca
- Config de TypeScript
- Quick fixes de plantillas
- Scripts npm
- Metadatos del paquete
- ADR Rust/Go vs JavaScript
- Pipeline de release
- Build de la librería (tipos)
- Script de release
- CI y librería core
- Soporte multi-framework
- Config de esbuild
- Guía de contribución
- Eventos de activación
- Workspace Trust
- Tipos de opentype
- Ramas y capa educativa
- Tests de integración
- Identidad visual
- build-lib
- Categorías Marketplace
- Banner galería
- Repositorio
- Prettier
- Smoke de la librería
- Plantillas de issues
- Plantillas de issues (error/propuesta)
- Código de conducta
- Tipos jsx-a11y

## God Nodes (most connected - your core abstractions)
1. `RuleExplanation` - 46 edges
2. `scripts` - 20 edges
3. `runEslint()` - 20 edges
4. `getFixes()` - 18 edges
5. `getExplanation()` - 16 edges
6. `Lupa A11y README` - 16 edges
7. `getAttr()` - 15 edges
8. `flavorFor()` - 15 edges
9. `CONTRIBUTING guide` - 14 edges
10. `mapMessages()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `npm run check:translations` --semantically_similar_to--> `Sufijo (sin traducir) para reglas sin traduccion`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → scripts/lib-README.md
- `Opcion 1: reescribir en Rust / oxlint` --conceptually_related_to--> `Uso de eslint.config del proyecto`  [INFERRED]
  docs/adr/0001-motor-en-javascript-no-rust-ni-go.md → README.md
- `runCli()` --indirect_call--> `file()`  [INFERRED]
  src/cli.ts → test/engine.test.ts
- `run()` --calls--> `runCli()`  [EXTRACTED]
  test/cli.test.ts → src/cli.ts
- `applyFix()` --calls--> `getFixes()`  [EXTRACTED]
  test/markupFixes.test.ts → src/fixes/index.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Release pipeline: verify -> GitHub Release / Marketplace / npm** — _github_workflows_release_verify, _github_workflows_release_github_release, _github_workflows_release_publish_marketplace, _github_workflows_release_publish_npm, docs_flujo_de_trabajo_trusted_publishing_oidc [EXTRACTED 1.00]
- **Optimizations that keep JS engine imperceptible** — docs_rendimiento_debounce_500_ms, docs_adr_0001_motor_en_javascript_no_rust_ni_go_cache_resultado_por_archivo, docs_adr_0001_motor_en_javascript_no_rust_ni_go_cache_ultimo_ast, docs_adr_0001_motor_en_javascript_no_rust_ni_go_ceder_hilo_cada_20_archivos, docs_rendimiento_un_analisis_por_documento, docs_adr_0001_motor_en_javascript_no_rust_ni_go_opcion_javascript_optimizada [INFERRED 0.85]
- **ESLint a11y engines wrapped by Spanish layer** — readme_eslint_plugin_jsx_a11y, readme_eslint_plugin_vuejs_accessibility, readme_html_eslint, readme_capa_educativa_en_espanol [EXTRACTED 1.00]

## Communities (109 total, 7 thin omitted)

### Community 0 - "Explicaciones en español (i18n)"
Cohesion: 0.05
Nodes (47): altText, anchorAmbiguousText, anchorHasContent, anchorIsValid, ariaActivedescendantHasTabindex, ariaProps, ariaProptypes, ariaRole (+39 more)

### Community 1 - "Motor, CLI y benchmark"
Cohesion: 0.06
Nodes (57): eslint, eslint, CASES, CliIO, collect(), EXCLUDED_DIRS, EXT, FileReport (+49 more)

### Community 2 - "Verificación de traducciones"
Cohesion: 0.06
Nodes (45): errors, htmlRules, knownRules, pluginRules, translated, translations, vueRules, LupaConfig (+37 more)

### Community 3 - "Contribuciones de VS Code"
Cohesion: 0.04
Nodes (45): properties, title, contributes, commands, configuration, menus, default, description (+37 more)

### Community 4 - "Dependencias de desarrollo"
Cohesion: 0.05
Nodes (43): @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-vuejs-accessibility, @fontsource/inter, globals, @html-eslint/eslint-plugin, opentype.js, devDependencies (+35 more)

### Community 5 - "Quick fixes JSX (AST)"
Cohesion: 0.19
Nodes (28): altTextFixes(), asNode(), attributes(), attrInsertOffset(), attrName(), elementName(), findTarget(), getAttr() (+20 more)

### Community 6 - "Esquema de ajustes"
Cohesion: 0.10
Nodes (28): enum, type, keywords, default, description, items, type, default (+20 more)

### Community 7 - "Generación de marca"
Cohesion: 0.13
Nodes (20): badge(), binaries, bold, Check, checks, contrast(), files, horizontal() (+12 more)

### Community 8 - "Config de TypeScript"
Cohesion: 0.09
Nodes (21): ES2022, esbuild.mjs, node, scripts, src, test, test/fixtures, compilerOptions (+13 more)

### Community 9 - "Quick fixes de plantillas"
Cohesion: 0.19
Nodes (19): altText(), Attr, baseName(), find(), hasSpread(), htmlHasLang(), insert(), markupFixes() (+11 more)

### Community 10 - "Scripts npm"
Cohesion: 0.10
Nodes (20): scripts, a11y, bench, build, build:brand, build:lib, build:tests, check:translations (+12 more)

### Community 11 - "Metadatos del paquete"
Cohesion: 0.13
Nodes (14): bugs, url, description, displayName, engines, vscode, homepage, icon (+6 more)

### Community 12 - "ADR Rust/Go vs JavaScript"
Cohesion: 0.27
Nodes (14): ADR 0001: motor sigue en JavaScript, Cache del ultimo resultado por archivo, Cache del ultimo AST para quick fixes, Ceder el hilo cada 20 archivos, Condiciones para reconsiderar (>100ms mediana, CLI en monorepos, parser nativo), Opcion 2: reescribir en Go, Opcion 3: seguir en JavaScript y optimizar (elegida), Opcion 1: reescribir en Rust / oxlint (+6 more)

### Community 13 - "Pipeline de release"
Cohesion: 0.28
Nodes (13): Release workflow, Job github-release, Job publish-marketplace (vsce --oidc), Job publish-npm, scripts/release.ts check/notes, Job verify (verificar y construir), Flujo de trabajo y releases, Pre-releases solo a GitHub y npm tag next (+5 more)

### Community 14 - "Build de la librería (tipos)"
Cohesion: 0.15
Nodes (12): src/lib.ts, src/types, ./tsconfig.json, compilerOptions, declaration, emitDeclarationOnly, noEmit, outDir (+4 more)

### Community 15 - "Script de release"
Cohesion: 0.33
Nodes (10): changelogPath, extractNotes(), fail(), isPrerelease(), isValidVersion(), main(), promoteUnreleased(), readPkg() (+2 more)

### Community 16 - "CI y librería core"
Cohesion: 0.22
Nodes (11): CI workflow, Tests de integracion en VS Code real (3 reintentos), CHANGELOG, Keep a Changelog / SemVer, CLI lupa-a11y, Quick fixes seguros, lupa-a11y-core README, lupa-a11y-core API (runEslint, mapMessages, getExplanation, getFixes, applyEdits, flavorFor, lintDocument) (+3 more)

### Community 17 - "Soporte multi-framework"
Cohesion: 0.24
Nodes (11): Soporte Vue/Svelte/Astro/Angular/HTML (Sin publicar), Lupa A11y README, Ajustes lupaA11y.*, Analizar todo el workspace, Barra de estado con contador de problemas, Uso de eslint.config del proyecto, eslint-plugin-vuejs-accessibility, @html-eslint (+3 more)

### Community 18 - "Config de esbuild"
Cohesion: 0.22
Nodes (8): options, production, tests, watch, root, sharedBundleOptions, stubVueLegacyConfig, dir

### Community 19 - "Guía de contribución"
Cohesion: 0.33
Nodes (9): Traduccion issue template, CONTRIBUTING guide, Pipeline: flavors -> templates -> runEslint/projectEslint -> mapDiagnostics -> extension/cli, npm run check:translations, Fixtures malo.tsx / bueno.tsx, Plantilla RuleExplanation, Normalizacion de plantillas sin mover posiciones, Reglas equivalentes comparten explicacion (alias) (+1 more)

### Community 20 - "Eventos de activación"
Cohesion: 0.22
Nodes (9): activationEvents, onLanguage:angular-html, onLanguage:astro, onLanguage:html, onLanguage:javascript, onLanguage:javascriptreact, onLanguage:svelte, onLanguage:typescriptreact (+1 more)

### Community 21 - "Workspace Trust"
Cohesion: 0.22
Nodes (9): capabilities, untrustedWorkspaces, virtualWorkspaces, description, restrictedConfigurations, supported, description, supported (+1 more)

### Community 22 - "Tipos de opentype"
Cohesion: 0.22
Nodes (4): Font, Glyph, opentype.js, Path

### Community 23 - "Ramas y capa educativa"
Cohesion: 0.25
Nodes (8): Dependabot config, Ignorar ESLint major (jsx-a11y no soporta ESLint 10), Pull request template, Guardia de main workflow, Guia de estilo de textos en espanol, Modelo de ramas main (produccion) / dev (desarrollo), Capa educativa en espanol, eslint-plugin-jsx-a11y

### Community 25 - "Identidad visual"
Cohesion: 0.50
Nodes (5): Brand identity README, npm run build:brand (build-brand.ts), Tipografia Inter Bold (OFL 1.1), Logo: lupa con figura humana abstracta, Paleta de marca (azul noche, cian, blanco)

### Community 26 - "build-lib"
Cohesion: 0.40
Nodes (3): out, pkg, root

### Community 27 - "Categorías Marketplace"
Cohesion: 0.50
Nodes (4): categories, Education, Linters, Programming Languages

### Community 28 - "Banner galería"
Cohesion: 0.67
Nodes (3): galleryBanner, color, theme

### Community 29 - "Repositorio"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **226 isolated node(s):** `printWidth`, `trailingComma`, `production`, `watch`, `tests` (+221 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dependencias de desarrollo` to `Motor, CLI y benchmark`, `Metadatos del paquete`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Why does `eslint` connect `Motor, CLI y benchmark` to `Dependencias de desarrollo`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **What connects `printWidth`, `trailingComma`, `production` to the rest of the system?**
  _226 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Explicaciones en español (i18n)` be split into smaller, more focused modules?**
  _Cohesion score 0.05236091631603553 - nodes in this community are weakly interconnected._
- **Should `Motor, CLI y benchmark` be split into smaller, more focused modules?**
  _Cohesion score 0.06070175438596491 - nodes in this community are weakly interconnected._
- **Should `Verificación de traducciones` be split into smaller, more focused modules?**
  _Cohesion score 0.056189640035118525 - nodes in this community are weakly interconnected._
- **Should `Contribuciones de VS Code` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._