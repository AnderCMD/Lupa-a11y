# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

## [1.1.0] - 2026-11-14

### Añadido

- Soporte para **Vue** (`.vue`, con `eslint-plugin-vuejs-accessibility`), **Svelte**, **Astro**, **plantillas de Angular** y **HTML** (con `@html-eslint`), además de `.js` con JSX (Next.js, Preact, Solid, Qwik…).
- Normalización de plantillas de Svelte, Astro y Angular sin mover posiciones: `alt={expr}`, atajo `{alt}`, bloques `{#if}`, frontmatter, `[alt]`, `[attr.aria-label]` y `bind-alt`.
- 8 explicaciones nuevas en español (campo sin etiqueta, salto de niveles de encabezado, zoom bloqueado, `<title>` de la página, role abstracto, encabezado dentro de un botón, `aria-hidden` en `<body>` y `role="presentation"` en elementos enfocables) y 30 reglas de Vue y HTML que reutilizan las explicaciones de JSX.
- Quick fixes para Vue, Svelte, Astro y HTML: imagen sin alt, `<html>` sin `lang`, `tabindex` positivo y `autofocus`.
- Comandos **Analizar todo el workspace** y **Limpiar resultados del análisis del workspace**.
- Quick fix **Ignorar <regla> en este workspace**.
- Contador de problemas en la barra de estado, con el origen de las reglas (preset o config del proyecto).
- Ajustes `lupaA11y.languages` y `lupaA11y.workspaceMaxFiles`.
- CLI `lupa-a11y` (en `lupa-a11y-core`) para CI: salida en texto o JSON, `--max-warnings`, `--ignore-rule` y `--project-config`.
- Benchmark por framework y [ADR 0001](docs/adr/0001-motor-en-javascript-no-rust-ni-go.md) con la evaluación de Rust y Go.

### Cambiado

- Si el `eslint.config.*` del proyecto no configura reglas de accesibilidad para un tipo de archivo, se usa el preset incluido en lugar de no mostrar nada.
- `lupaA11y.ignoreRules` con un id de `jsx-a11y/*` también ignora sus equivalentes de Vue y HTML.
- Se reutiliza el último resultado si el texto no cambió, y el último AST para los quick fixes.

## [1.0.3] - 2026-11-04

### Cambiado

- La publicación en el Marketplace usa trusted publishing (OIDC, `vsce publish --oidc`), sin `VSCE_PAT`.

## [1.0.2] - 2026-10-21

### Añadido

- Capturas de pantalla en el README, código de conducta y plantilla de propuestas.

### Cambiado

- La publicación en el Marketplace y en npm es opcional (variables `PUBLISH_MARKETPLACE` y `PUBLISH_NPM`); por defecto el release solo crea el GitHub Release con el `.vsix`.
- La publicación en npm usa trusted publishing (OIDC), sin token.

## [1.0.1] - 2026-10-19

### Corregido

- El id del editor en el Marketplace es `AnderCMD` (con esas mayúsculas); se corrige `publisher` en `package.json`.

## [1.0.0] - 2026-10-19

### Añadido

- Diagnósticos de accesibilidad en archivos `.jsx` y `.tsx` con mensajes en español, usando `eslint-plugin-jsx-a11y` como motor.
- Explicación completa de 35 reglas: por qué importa, a quién afecta, ejemplo incorrecto y correcto, y criterio WCAG 2.2.
- Hover con la explicación y acción "Ver explicación" que abre un panel respetuoso con el tema claro/oscuro.
- Quick fixes seguros para `alt-text`, `click-events-have-key-events`, `no-static-element-interactions`, `html-has-lang`, `img-redundant-alt`, `tabindex-no-positive` y `no-autofocus`.
- Ajustes `lupaA11y.enable`, `severity`, `criticalRulesAsError`, `ignoreRules`, `lintOn`, `useProjectEslintConfig` y `maxFileSizeKb`; comando "Alternar linting de accesibilidad".
- Uso de la configuración de ESLint del proyecto (flat config) cuando existe, con respeto de Workspace Trust y vuelta al preset incluido si falla.
- Mensaje original con el sufijo "(sin traducir)" para las reglas del plugin que aún no tienen traducción.
- Logotipo e identidad visual (`assets/brand/`), generados con `npm run build:brand`.
- Script `check-translations`, tests con Vitest, tests de integración con `@vscode/test-electron` y CI en GitHub Actions.
- Librería `lupa-a11y-core` (traducciones, motor y quick fixes sin VS Code) para npm, con ESM, CJS y tipos.
- Flujo de ramas `main` (producción) / `dev` (desarrollo) y release automático por etiqueta: GitHub Release, Marketplace y npm.
