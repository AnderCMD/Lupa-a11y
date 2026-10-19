# Rendimiento

Medición con `npm run bench`: analiza con el preset incluido un archivo TSX de 511 líneas (16,5 KB) que a propósito tiene muchos problemas (300 diagnósticos), así que es un caso más pesado que un archivo real.

| Medida                                 | Resultado |
| -------------------------------------- | --------- |
| Primera ejecución (en frío)            | 56 ms     |
| Ejecuciones siguientes (mediana, n=30) | 17 ms     |
| Ejecuciones siguientes (p95)           | 33 ms     |

Entorno: Apple M3, Node 26.11 ejecutando el script directamente. **No se midió dentro de VS Code** (su Node/Electron y el resto de extensiones pueden cambiar los tiempos). Vuelve a medir en tu máquina con `npm run bench`.

Cómo se mantiene imperceptible al escribir:

- Debounce de 500 ms tras la última pulsación.
- El análisis con el preset es síncrono y dura decenas de milisegundos; con la config del proyecto es asíncrono.
- Solo hay un análisis por documento a la vez; si llega otro, se repite con el último contenido y se descarta el resultado obsoleto.
- Archivos de más de `lupaA11y.maxFileSizeKb` (500 KB por defecto) se omiten.
