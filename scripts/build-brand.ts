/**
 * Genera la identidad visual de Lupa A11y.
 * Los SVG se construyen a mano a partir de formas geométricas; el texto se
 * convierte a trazados (Inter, licencia OFL 1.1). Los PNG salen siempre de los SVG.
 *
 *   npm run build:brand
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import * as opentype from "opentype.js";
import { optimize } from "svgo";

const root = join(__dirname, "..");
const out = join(root, "assets", "brand");
mkdirSync(out, { recursive: true });

// ---------- Paleta ----------
const NAVY = "#0F172A";
const CYAN = "#22D3EE";
const WHITE = "#FFFFFF";

// ---------- Tipografía (Inter, OFL 1.1) ----------
function loadFont(weight: 400 | 700): opentype.Font {
  const file = join(
    root,
    "node_modules/@fontsource/inter/files",
    `inter-latin-${weight}-normal.woff`,
  );
  const buf = readFileSync(file);
  return opentype.parse(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
  );
}
const bold = loadFont(700);
const regular = loadFont(400);

/**
 * Composición glifo a glifo (con kerning). `Font.getPath` falla con las
 * sustituciones contextuales de Inter que opentype.js no soporta, y para un
 * wordmark corto no hacen falta.
 */
function textPath(
  font: opentype.Font,
  text: string,
  x: number,
  baseline: number,
  size: number,
  fill: string,
): { svg: string; width: number } {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  let prev: opentype.Glyph | undefined;
  const parts: string[] = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    if (prev) cursor += font.getKerningValue(prev, glyph) * scale;
    parts.push(glyph.getPath(cursor, baseline, size).toPathData(2));
    cursor += glyph.advanceWidth * scale;
    prev = glyph;
  }
  return { svg: `<path fill="${fill}" d="${parts.join("")}"/>`, width: cursor - x };
}

// ---------- Símbolo (caja de 64×64) ----------
interface MarkColors {
  ring: string;
  handle: string;
  glass?: string;
  person: string;
}

/** Lupa con una figura humana abstracta (cabeza + arco de brazos abiertos). */
function markShapes(c: MarkColors, thick = false): string {
  const ringW = thick ? 8 : 6;
  const headR = thick ? 5.5 : 4.5;
  const armW = thick ? 4.5 : 3.4;
  return [
    c.glass ? `<circle cx="27" cy="27" r="17" fill="${c.glass}"/>` : "",
    `<circle cx="27" cy="27" r="20" fill="none" stroke="${c.ring}" stroke-width="${ringW}"/>`,
    `<path d="M42 42 57 57" stroke="${c.handle}" stroke-width="${thick ? 9 : 8}" stroke-linecap="round" fill="none"/>`,
    `<circle cx="27" cy="19" r="${headR}" fill="${c.person}"/>`,
    `<path d="M16.5 26Q27 40 37.5 26" fill="none" stroke="${c.person}" stroke-width="${armW}" stroke-linecap="round"/>`,
  ].join("");
}

const COLORS = {
  badge: { ring: CYAN, handle: CYAN, person: WHITE },
  light: { ring: NAVY, handle: NAVY, glass: CYAN, person: NAVY },
  dark: { ring: CYAN, handle: CYAN, person: WHITE },
  mono: { ring: NAVY, handle: NAVY, person: NAVY },
} satisfies Record<string, MarkColors>;

/** Símbolo sobre insignia azul noche: funciona sobre cualquier fondo. */
function badge(thick = false): string {
  return (
    `<rect width="64" height="64" rx="14" fill="${NAVY}"/>` +
    `<g transform="translate(6 6) scale(.8)">${markShapes(COLORS.badge, thick)}</g>`
  );
}

const TITLE = "Logotipo de Lupa A11y";
const DESC = "Una lupa con una figura humana abstracta en el cristal";

function svgDoc(viewBox: string, body: string, title = TITLE, desc = DESC): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="titulo descripcion">` +
    `<title id="titulo">${title}</title><desc id="descripcion">${desc}</desc>${body}</svg>`
  );
}

function optimized(svg: string): string {
  return optimize(svg, {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: { overrides: { cleanupIds: { minify: false } } },
      },
    ],
  }).data;
}

// ---------- SVG ----------
const files: Record<string, string> = {};

files["logo-mark.svg"] = svgDoc("0 0 64 64", badge());
files["logo-mark-mono.svg"] = svgDoc("0 0 64 64", markShapes(COLORS.mono));
files["favicon.svg"] = svgDoc("0 0 64 64", badge(true), "Icono de Lupa A11y");

const WORDMARK_SIZE = 40;
const GAP = 14;
function horizontal(textFill: string, colors: MarkColors): string {
  const x = 64 + GAP;
  const t = textPath(bold, "Lupa A11y", x, 44, WORDMARK_SIZE, textFill);
  const w = Math.ceil(x + t.width + 2);
  return svgDoc(`0 0 ${w} 64`, markShapes(colors) + t.svg);
}
files["logo-horizontal-light.svg"] = horizontal(NAVY, COLORS.light);
files["logo-horizontal-dark.svg"] = horizontal(WHITE, COLORS.dark);

// Fuente de la imagen social (no se publica en el .vsix).
function socialPreview(): string {
  const W = 1280;
  const H = 640;
  const word = textPath(bold, "Lupa A11y", 520, 330, 120, WHITE);
  const l1 = textPath(regular, "Accesibilidad para React,", 524, 424, 44, WHITE);
  const l2 = textPath(regular, "explicada en español.", 524, 480, 44, WHITE);
  const widest = Math.max(520 + word.width, 524 + l1.width, 524 + l2.width);
  if (widest > W - 60) throw new Error(`Texto demasiado ancho: ${widest}`);
  const body =
    `<rect width="${W}" height="${H}" fill="${NAVY}"/>` +
    `<g transform="translate(140 160) scale(5)">${markShapes(COLORS.dark)}</g>` +
    word.svg +
    `<rect x="524" y="370" width="96" height="6" rx="3" fill="${CYAN}"/>` +
    l1.svg +
    l2.svg;
  return svgDoc(`0 0 ${W} ${H}`, body, "Lupa A11y: accesibilidad para React, explicada en español");
}

for (const [name, svg] of Object.entries(files)) {
  files[name] = optimized(svg);
}
const socialSvg = optimized(socialPreview());

// ---------- PNG (siempre desde los SVG) ----------
function render(svg: string, width: number): Buffer {
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

const binaries: Record<string, Buffer> = {
  "icon-128.png": render(files["logo-mark.svg"]!, 128),
  "icon-256.png": render(files["logo-mark.svg"]!, 256),
  // El Marketplace no admite SVG en el README: se usan estos PNG en la cabecera.
  "logo-horizontal-light.png": render(files["logo-horizontal-light.svg"]!, 720),
  "logo-horizontal-dark.png": render(files["logo-horizontal-dark.svg"]!, 720),
  "social-preview-1280x640.png": render(socialSvg, 1280),
};

// ---------- Hoja de prueba de legibilidad ----------
function previewSheet(): Buffer {
  const sizes = [16, 32, 64, 128];
  const variants: { label: string; inner: string }[] = [
    { label: "badge", inner: badge() },
    { label: "favicon", inner: badge(true) },
  ];
  const pad = 24;
  const colW = sizes.reduce((a, s) => a + s + pad, pad);
  const rowH = 128 + pad * 2;
  let body = "";
  let y = 0;
  const panels = [
    { bg: WHITE, themed: markShapes(COLORS.light) },
    { bg: NAVY, themed: markShapes(COLORS.dark) },
  ];
  for (const [i, p] of panels.entries()) {
    const rows = [{ label: "tema", inner: p.themed }, ...variants];
    body += `<rect x="${i * colW}" y="0" width="${colW}" height="${rows.length * rowH}" fill="${p.bg}"/>`;
    rows.forEach((row, r) => {
      let x = i * colW + pad;
      for (const s of sizes) {
        body += `<g transform="translate(${x} ${r * rowH + pad + (128 - s) / 2}) scale(${s / 64})">${row.inner}</g>`;
        x += s + pad;
      }
    });
    y = rows.length * rowH;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${colW * 2} ${y}" width="${colW * 2}" height="${y}">${body}</svg>`;
  // 16 px reales: se rasteriza el SVG a su tamaño natural (1 px SVG = 1 px).
  return render(svg, colW * 2);
}
binaries["preview-sheet.png"] = previewSheet();

// ---------- Contraste (WCAG 2.2) ----------
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

interface Check {
  what: string;
  fg: string;
  bg: string;
  min: number;
}
const checks: Check[] = [
  { what: "Insignia (azul noche) sobre fondo claro", fg: NAVY, bg: WHITE, min: 3 },
  { what: "Anillo/mango cian sobre insignia", fg: CYAN, bg: NAVY, min: 3 },
  { what: "Figura blanca sobre insignia", fg: WHITE, bg: NAVY, min: 3 },
  { what: "Variante clara: anillo/mango sobre blanco", fg: NAVY, bg: WHITE, min: 3 },
  { what: "Variante clara: figura sobre el cristal cian", fg: NAVY, bg: CYAN, min: 3 },
  { what: "Variante oscura: anillo/mango cian sobre azul noche", fg: CYAN, bg: NAVY, min: 3 },
  { what: "Variante oscura: figura blanca sobre azul noche", fg: WHITE, bg: NAVY, min: 3 },
  { what: "Una tinta: azul noche sobre blanco", fg: NAVY, bg: WHITE, min: 3 },
  { what: "Texto del logotipo claro (azul noche sobre blanco)", fg: NAVY, bg: WHITE, min: 4.5 },
  { what: "Texto del logotipo oscuro (blanco sobre azul noche)", fg: WHITE, bg: NAVY, min: 4.5 },
  { what: "Texto de la imagen social (blanco sobre azul noche)", fg: WHITE, bg: NAVY, min: 4.5 },
];

let failed = false;
console.log("\nContrastes (WCAG 2.2):");
for (const c of checks) {
  const ratio = contrast(c.fg, c.bg);
  const ok = ratio >= c.min;
  failed ||= !ok;
  console.log(`  ${ok ? "OK  " : "FALLA"} ${ratio.toFixed(2)}:1 (mín. ${c.min}:1)  ${c.what}`);
}
console.log(
  `  info  ${contrast(CYAN, WHITE).toFixed(2)}:1  cian sobre blanco (no se usa: por eso la variante clara usa azul noche)`,
);

// ---------- Escritura ----------
for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(out, name), svg);
  console.log(`${name}  ${(Buffer.byteLength(svg) / 1024).toFixed(2)} KB`);
}
writeFileSync(join(out, "social-preview.svg"), socialSvg);
for (const [name, buf] of Object.entries(binaries)) {
  writeFileSync(join(out, name), buf);
  console.log(`${name}  ${(buf.length / 1024).toFixed(1)} KB`);
}
if (failed) {
  console.error("\nAlgún contraste no cumple el mínimo.");
  process.exit(1);
}
