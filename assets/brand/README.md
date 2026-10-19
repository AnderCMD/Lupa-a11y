# Identidad visual de Lupa A11y

## Significado

Una **lupa** que revela lo que normalmente no se ve: los problemas de accesibilidad y la explicación de por qué importan. Dentro del cristal hay una **figura humana abstracta** (un círculo como cabeza y un arco como brazos abiertos): detrás de cada regla hay una persona.

El diseño es original, hecho a mano con formas geométricas simples (dos círculos, dos trazos). No imita el Símbolo Internacional de Accesibilidad, el icono "Acceso universal" de la ONU ni logotipos de axe/Deque, ESLint, W3C o VS Code.

## Archivos

| Archivo | Uso |
|---|---|
| `logo-mark.svg` | Símbolo a color sobre insignia azul noche; funciona sobre cualquier fondo |
| `logo-mark-mono.svg` | Símbolo en una sola tinta (azul noche); para impresión o fondos claros |
| `logo-horizontal-light.svg` / `.png` | Símbolo + texto, para fondos claros |
| `logo-horizontal-dark.svg` / `.png` | Símbolo + texto, para fondos oscuros |
| `favicon.svg` | Versión de trazo grueso para tamaños muy pequeños |
| `icon-128.png`, `icon-256.png` | Icono de la extensión (`icon-256.png` es el que usa `package.json`) |
| `social-preview-1280x640.png` | Imagen para compartir el repositorio |
| `social-preview.svg` | Fuente de la imagen social |
| `preview-sheet.png` | Hoja de prueba de legibilidad (no se versiona ni se publica) |

Los PNG del README (`logo-horizontal-*.png`) existen porque el Marketplace de VS Code no admite SVG en el README.

Todo se regenera con:

```bash
npm run build:brand
```

## Paleta

| Color | Valor | Uso |
|---|---|---|
| Azul noche | `#0F172A` | Insignia, fondo oscuro, trazos sobre fondo claro |
| Cian | `#22D3EE` | Anillo y mango sobre fondo oscuro; cristal en la variante clara |
| Blanco | `#FFFFFF` | Figura y texto sobre fondo oscuro |

El ámbar de acento (`#FBBF24`) del punto de partida **no se usa**: el símbolo funciona con tres colores y un acento más se perdería al reducir.

Cian sobre blanco da solo 1,81:1, así que **sobre fondo claro el anillo y el mango van en azul noche** y el cian queda como relleno decorativo del cristal.

## Contrastes (verificados por `build-brand.ts`)

| Par | Relación | Mínimo |
|---|---|---|
| Azul noche sobre blanco (insignia, anillo, texto claro) | 17,85:1 | 3:1 gráficos / 4,5:1 texto |
| Cian sobre azul noche (anillo y mango) | 9,88:1 | 3:1 |
| Blanco sobre azul noche (figura, texto oscuro, imagen social) | 17,85:1 | 3:1 / 4,5:1 |
| Azul noche sobre cian (figura sobre el cristal) | 9,88:1 | 3:1 |

El significado no depende solo del color: la lupa y la figura se distinguen por su forma, y la versión de una sola tinta se lee igual.

## Tipografía

El texto "Lupa A11y" usa **Inter Bold** (Rasmus Andersson y The Inter Project Authors), licencia **SIL Open Font License 1.1**. El texto está **convertido a trazados**, así que los SVG no dependen de ninguna fuente instalada.

## Uso

- **Espacio libre:** deja alrededor del logotipo al menos el ancho del anillo del cristal (≈ 1/10 de la altura del símbolo).
- **Tamaño mínimo:** símbolo 16 px (usa `favicon.svg`); logotipo horizontal 96 px de ancho. A 16 px la figura interior se reduce a un punto y el reconocimiento recae en la lupa.
- **No hacer:** cambiar los colores fuera de la paleta, estirar o girar el símbolo, añadir sombras o degradados, poner la variante clara sobre fondos oscuros (ni al revés), ni usar el cian sobre blanco.

## Social preview de GitHub (paso manual)

GitHub no permite subir esta imagen por API ni por commit:

1. Abre el repositorio → **Settings** → **General**.
2. Baja hasta **Social preview** y pulsa **Edit** → **Upload an image**.
3. Elige `assets/brand/social-preview-1280x640.png`.

## Licencia

Los recursos de marca se publican bajo la misma licencia MIT del proyecto. La tipografía Inter conserva su propia licencia OFL 1.1.
