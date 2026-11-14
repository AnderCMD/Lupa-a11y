# Rendimiento

Medición con `npm run bench`: analiza con el preset incluido un archivo de ~500 líneas (16-17 KB) por framework, que a propósito tiene muchos problemas (cientos de diagnósticos), así que es un caso más pesado que un archivo real.

| Framework      | En frío | Mediana (n=30) | p95   |
| -------------- | ------- | -------------- | ----- |
| JSX/TSX        | 55 ms   | 18 ms          | 25 ms |
| Vue            | 28 ms   | 12 ms          | 16 ms |
| Svelte         | 18 ms   | 8 ms           | 13 ms |
| HTML / Angular | 6 ms    | 7 ms           | 8 ms  |

Entorno: Apple M3, Node 26.13 ejecutando el script directamente. **No se midió dentro de VS Code** (su Node/Electron y el resto de extensiones pueden cambiar los tiempos). Vuelve a medir en tu máquina con `npm run bench`.

Cómo se mantiene imperceptible al escribir:

- Debounce de 500 ms tras la última pulsación.
- El análisis con el preset es síncrono y dura milisegundos; con la config del proyecto es asíncrono.
- Solo hay un análisis por documento a la vez; si llega otro, se repite con el último contenido y se descarta el resultado obsoleto.
- Si el texto no cambió desde el último análisis (por ejemplo, al guardar justo después de escribir), se reutiliza el resultado.
- Los quick fixes reutilizan el último AST mientras el texto no cambie.
- "Analizar todo el workspace" cede el hilo cada 20 archivos para no bloquear el editor.
- Archivos de más de `lupaA11y.maxFileSizeKb` (500 KB por defecto) se omiten.

## ¿Rust o Go?

Se evaluó migrar el motor y se decidió no hacerlo: el análisis ya es entre 15 y 70 veces más rápido que la espera de 500 ms, y migrar costaría la compatibilidad con Vue, Svelte, Astro, Angular y el `eslint.config.*` del proyecto. Los datos y las condiciones para reconsiderarlo están en [ADR 0001](adr/0001-motor-en-javascript-no-rust-ni-go.md).
