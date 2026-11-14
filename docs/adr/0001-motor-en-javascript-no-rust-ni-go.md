# ADR 0001: el motor sigue en JavaScript (no se migra a Rust ni a Go)

- **Estado:** aceptada
- **Fecha:** 2026-11-14

## Contexto

Se planteó reescribir el motor en Rust o Go para que todo funcione más rápido. Antes de decidir se midió dónde se va el tiempo hoy (Apple M3, Node 26, `npm run bench`):

| Archivo de ~500 líneas (con cientos de problemas a propósito) | Mediana | p95   |
| ------------------------------------------------------------- | ------- | ----- |
| JSX/TSX                                                       | 18 ms   | 25 ms |
| Vue                                                           | 12 ms   | 16 ms |
| Svelte                                                        | 8 ms    | 13 ms |
| HTML / Angular                                                | 7 ms    | 8 ms  |

En un archivo JSX de 87 KB (5 veces más grande que uno típico), el **parseo** con `@typescript-eslint/parser` es cerca del **48 %** del tiempo y el recorrido de las reglas más el análisis de ámbitos, el resto.

La extensión espera **500 ms** tras la última pulsación antes de analizar. El análisis tarda entre 15 y 70 veces menos que esa espera: la persona no lo percibe.

## Opciones evaluadas

### 1. Reescribir las reglas en Rust (o usar oxlint)

[oxlint](https://oxc.rs/) ya trae en Rust la mayoría de reglas de `jsx-a11y`, y es de 50 a 100 veces más rápido que ESLint.

- ✅ Mucho más rápido en proyectos grandes (por ejemplo, un análisis de todo el monorepo en CI).
- ❌ Un binario nativo por plataforma (macOS x64/arm64, Linux x64/arm64/musl, Windows x64/arm64): habría que publicar un `.vsix` por plataforma o compilar a WebAssembly.
- ❌ No cubre Vue, Svelte, Astro ni las plantillas de Angular con la misma profundidad que los plugins de ESLint.
- ❌ Se pierde la compatibilidad con el `eslint.config.*` del proyecto, una función clave.
- ❌ Las reglas no son idénticas: habría que volver a validar los 43 textos y los quick fixes.

### 2. Reescribir en Go

- ❌ No hay un ecosistema maduro de parsers de JSX/TSX + Vue + Svelte en Go (esbuild está en Go, pero no expone su AST).
- ❌ Las mismas desventajas de binarios nativos que Rust, sin un motor de reglas existente: habría que reimplementar todo.

### 3. Seguir en JavaScript y optimizar lo que se nota (elegida)

- Caché del último resultado por archivo: si el texto no cambió (guardar justo después de escribir, cambiar de pestaña), no se vuelve a analizar.
- Caché del último AST para los quick fixes: VS Code pide code actions muchas veces sobre el mismo texto.
- Los eventos de cambio sin contenido (por ejemplo, cuando solo cambia el estado de guardado) no programan análisis.
- El análisis de todo el workspace cede el hilo cada 20 archivos para que el editor siga respondiendo.

## Decisión

Se mantiene el motor en JavaScript sobre ESLint, y se suman las optimizaciones de la opción 3.

La velocidad no es un problema que la persona perciba, y una migración costaría compatibilidad (Vue, Svelte, Astro, Angular, `eslint.config.*`) y meses de trabajo.

## Cuándo reconsiderarlo

- Si el análisis de un archivo típico supera los **100 ms** de mediana en una máquina media.
- Si la CLI se usa en monorepos donde tarda más de un minuto: entonces se puede añadir **oxlint como motor opcional solo para la CLI** (`--engine oxlint`), sin tocar la extensión.
- Si `@typescript-eslint/parser` admite un parser nativo (por ejemplo, el de oxc vía NAPI) compatible con ESLint: sería una mejora sin cambiar de lenguaje.
