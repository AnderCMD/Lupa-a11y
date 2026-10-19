<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/brand/logo-horizontal-dark.png">
    <img src="assets/brand/logo-horizontal-light.png" alt="Logotipo de Lupa A11y: una lupa con una figura humana abstracta en el cristal, junto al texto Lupa A11y" width="360">
  </picture>
</p>

# Lupa A11y

[![CI](https://github.com/AnderCMD/Lupa-a11y/actions/workflows/ci.yml/badge.svg)](https://github.com/AnderCMD/Lupa-a11y/actions/workflows/ci.yml)
[![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)

**Linter de accesibilidad para React (JSX/TSX) con explicaciones en español.**

Lupa A11y detecta problemas de accesibilidad mientras escribes y no se queda en "esto está mal": te explica **por qué importa**, **a quién afecta**, te muestra un ejemplo **mal vs. bien** y te dice qué criterio de [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/) toca. Está pensada para quien está aprendiendo.

## Por qué existe

Ya hay linters de accesibilidad muy buenos, pero están en inglés. Lupa A11y no reimplementa reglas: usa [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) como motor y le añade una **capa educativa en español**. El valor está en la calidad de los textos y en la experiencia dentro del editor.

## Qué hace

- **Diagnósticos** en el panel Problems y subrayados, con un mensaje corto en español.
- **Hover** con título, motivo, ejemplo mal/bien y enlace al criterio WCAG.
- **"Ver explicación"**: un panel con la explicación completa, legible en tema claro y oscuro.
- **Quick fixes seguros**: nunca inventan contenido que necesita criterio humano (por ejemplo, no escriben descripciones de imágenes).
- Respeta tu configuración de ESLint si el proyecto tiene una, y [Workspace Trust](https://code.visualstudio.com/docs/editor/workspace-trust).
- Sin telemetría y sin llamadas de red mientras la usas.

> **Demo (GIF pendiente).** Guion para grabarlo (≈ 20 s, tema oscuro, fuente grande): 1) abre un `.tsx` vacío y escribe `<img src="/grafica.png" />`; 2) espera el subrayado y pasa el cursor para mostrar el hover; 3) clic en "Ver explicación" y deja ver el panel; 4) vuelve al código, pulsa `Ctrl+.` y elige "Marcar la imagen como decorativa"; 5) escribe `<div onClick={abrir}>Menú</div>` y aplica "Convertir en `<button>`".

## Instalación

Desde la línea de comandos, con el `.vsix` de la [última CI](../../actions) o generado por ti (`npm run package`):

```bash
code --install-extension lupa-a11y-1.0.0.vsix
```

Requiere VS Code 1.100 o superior. Cuando se publique en el Marketplace bastará con buscar "Lupa A11y".

## Uso

Abre un archivo `.jsx` o `.tsx`. Los problemas aparecen solos. Con el cursor sobre un subrayado:

- **Hover** para el resumen.
- **Ctrl+.** (o ⌘+. en macOS) para los quick fixes y "Ver explicación".

Comando de la paleta: **Lupa A11y: Alternar linting de accesibilidad**.

## Ajustes

| Ajuste                            | Por defecto | Descripción                                                                      |
| --------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `lupaA11y.enable`                 | `true`      | Activa o desactiva la extensión.                                                 |
| `lupaA11y.severity`               | `warning`   | Severidad por defecto: `error`, `warning`, `information` o `hint`.               |
| `lupaA11y.criticalRulesAsError`   | `false`     | Muestra como Error `alt-text`, `aria-role` y `aria-props`.                       |
| `lupaA11y.ignoreRules`            | `[]`        | Reglas a ignorar, p. ej. `"jsx-a11y/alt-text"`.                                  |
| `lupaA11y.lintOn`                 | `type`      | `type` analiza mientras escribes (con 500 ms de espera); `save` solo al guardar. |
| `lupaA11y.useProjectEslintConfig` | `true`      | Usa el `eslint.config.*` del proyecto si existe (solo reglas `jsx-a11y/*`).      |
| `lupaA11y.maxFileSizeKb`          | `500`       | Los archivos más grandes se omiten.                                              |

**Configuración del proyecto.** Si existe `eslint.config.js|mjs|cjs` y el workspace es de confianza, se usan las reglas `jsx-a11y/*` que tú hayas configurado (las demás se ignoran). En un workspace no confiable no se ejecuta esa configuración —es código— y se usa el preset incluido. Si no se puede cargar, vuelve al preset y avisa una sola vez en el canal de salida "Lupa A11y". Las configuraciones en TypeScript (`eslint.config.ts`) no están soportadas.

## Reglas cubiertas (35)

| Regla                                           | Criterio WCAG 2.2                            | Nivel          |
| ----------------------------------------------- | -------------------------------------------- | -------------- |
| `alt-text`                                      | 1.1.1 Contenido no textual                   | A              |
| `anchor-is-valid`                               | 4.1.2 Nombre, función, valor                 | A              |
| `anchor-has-content`                            | 2.4.4 Propósito de los enlaces               | A              |
| `click-events-have-key-events`                  | 2.1.1 Teclado                                | A              |
| `no-static-element-interactions`                | 4.1.2 Nombre, función, valor                 | A              |
| `interactive-supports-focus`                    | 2.1.1 Teclado                                | A              |
| `label-has-associated-control`                  | 1.3.1 Información y relaciones               | A              |
| `control-has-associated-label`                  | 4.1.2 Nombre, función, valor                 | A              |
| `aria-props`                                    | 4.1.2 Nombre, función, valor                 | A              |
| `aria-role`                                     | 4.1.2 Nombre, función, valor                 | A              |
| `role-has-required-aria-props`                  | 4.1.2 Nombre, función, valor                 | A              |
| `heading-has-content`                           | 2.4.6 Encabezados y etiquetas                | AA             |
| `html-has-lang`                                 | 3.1.1 Idioma de la página                    | A              |
| `img-redundant-alt`                             | 1.1.1 Contenido no textual                   | Buena práctica |
| `no-autofocus`                                  | 2.4.3 Orden del foco                         | Buena práctica |
| `tabindex-no-positive`                          | 2.4.3 Orden del foco                         | A              |
| `media-has-caption`                             | 1.2.2 Subtítulos (grabados)                  | A              |
| `iframe-has-title`                              | 4.1.2 Nombre, función, valor                 | A              |
| `anchor-ambiguous-text`                         | 2.4.4 Propósito de los enlaces               | A              |
| `aria-activedescendant-has-tabindex`            | 2.1.1 Teclado                                | A              |
| `aria-proptypes`                                | 4.1.2 Nombre, función, valor                 | A              |
| `aria-unsupported-elements`                     | 4.1.2 Nombre, función, valor                 | A              |
| `autocomplete-valid`                            | 1.3.5 Identificar el propósito de la entrada | AA             |
| `lang`                                          | 3.1.1 Idioma de la página                    | A              |
| `mouse-events-have-key-events`                  | 2.1.1 Teclado                                | A              |
| `no-access-key`                                 | 2.1.4 Atajos con teclado de caracteres       | Buena práctica |
| `no-aria-hidden-on-focusable`                   | 4.1.2 Nombre, función, valor                 | A              |
| `no-distracting-elements`                       | 2.2.2 Pausar, detener, ocultar               | A              |
| `no-interactive-element-to-noninteractive-role` | 4.1.2 Nombre, función, valor                 | A              |
| `no-noninteractive-element-interactions`        | 4.1.2 Nombre, función, valor                 | A              |
| `no-noninteractive-element-to-interactive-role` | 4.1.2 Nombre, función, valor                 | A              |
| `no-noninteractive-tabindex`                    | 2.4.3 Orden del foco                         | Buena práctica |
| `no-redundant-roles`                            | 4.1.2 Nombre, función, valor                 | Buena práctica |
| `role-supports-aria-props`                      | 4.1.2 Nombre, función, valor                 | A              |
| `scope`                                         | 1.3.1 Información y relaciones               | A              |

Las 4 reglas del plugin sin traducir no están en el preset: tres están obsoletas en el plugin (`accessible-emoji`, `label-has-for`, `no-onchange`) y `prefer-tag-over-role` es opinionada. El resto de reglas del plugin están traducidas.

El preset parte de `recommended` de `eslint-plugin-jsx-a11y` y le añade `control-has-associated-label`, `anchor-ambiguous-text`, `lang` y `no-aria-hidden-on-focusable`, y entiende palabras en español en `img-redundant-alt` y `anchor-ambiguous-text`.

Quick fixes disponibles: `alt-text`, `click-events-have-key-events`, `no-static-element-interactions`, `html-has-lang`, `img-redundant-alt`, `tabindex-no-positive` y `no-autofocus`.

## Limitaciones (honestas)

- **El análisis estático no detecta todo.** Ve el código, no la página renderizada: no sabe si un texto alternativo es bueno, si los subtítulos son correctos ni si un componente propio renderiza HTML accesible.
- **No sustituye probar con un lector de pantalla** ni con el teclado, ni una auditoría de accesibilidad.
- **No calcula contraste de color**: eso requiere renderizar la página.
- `img-redundant-alt` detecta palabras en español ("imagen", "foto", "fotografía"); como el plugin compara por palabras, puede haber falsos positivos con alt no ASCII y palabras que contengan "foto" (p. ej. "fotosíntesis").
- Los archivos con errores de sintaxis se ignoran en silencio hasta que se arreglan.
- Solo `.jsx` y `.tsx` (y archivos que VS Code trate como React). El motor es ESLint 9 (el plugin aún no declara compatibilidad con ESLint 10).
- Rendimiento medido solo en Node, no dentro de VS Code: ver [docs/rendimiento.md](docs/rendimiento.md).

## Librería para tus propias herramientas

El núcleo (traducciones, motor y quick fixes, sin VS Code) se publica en npm como [`lupa-a11y-core`](https://www.npmjs.com/package/lupa-a11y-core). Ejemplo de uso en su README.

## Hoja de ruta

Fuera de la v1: HTML, Vue, Svelte y Angular; contraste de color real; otros editores; otros idiomas (la estructura de `src/i18n/` ya está preparada, sin selector de idioma todavía).

## Contribuir

Las traducciones por PR son bienvenidas. Mira [CONTRIBUTING.md](CONTRIBUTING.md) para la plantilla y la guía de estilo. Identidad visual: [assets/brand/README.md](assets/brand/README.md).

## Agradecimientos

- [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) y sus mantenedores: sin su trabajo este proyecto no existiría.
- [W3C WAI](https://www.w3.org/WAI/) y las [Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2](https://www.w3.org/TR/WCAG22/), de donde salen los criterios.
- [Inter](https://rsms.me/inter/) (SIL OFL 1.1), la tipografía del logotipo.

Lupa A11y es un proyecto independiente, sin relación con W3C, Deque, ESLint ni Microsoft.

## Licencia

[MIT](LICENSE)
