# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

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
