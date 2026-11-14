/**
 * Normaliza plantillas de Svelte, Astro y Angular para que el parser de HTML
 * las entienda, **sin cambiar la longitud ni los saltos de línea** (las
 * posiciones de los diagnósticos siguen apuntando al texto original).
 *
 * - `{expresión}` en atributos (`alt={x}`) → `alt="xxx"` (atributo con valor dinámico);
 *   los literales conservan su valor (`tabindex={3}` → `tabindex="3"`).
 * - `{atajo}` en atributos (`<img {alt}>`) → ` alt ` (atributo presente).
 * - `{expresión}` en el texto → `_____` (contenido, así un encabezado `<h1>{t}</h1>` no está vacío).
 * - Frontmatter de Astro (`---` … `---`) → espacios.
 * - Bindings de Angular `[alt]`, `[attr.aria-label]`, `bind-alt` → `alt`, `aria-label`…
 */
export type TemplateFlavor = "svelte" | "astro" | "html";

const keepNewlines = (s: string, ch: string): string => s.replace(/[^\n]/g, ch);

/** Índice del `}` que cierra el `{` en `open`, o -1. Salta cadenas y plantillas de JS. */
export function matchBrace(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      for (i++; i < text.length && text[i] !== quote; i++) if (text[i] === "\\") i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i;
  }
  return -1;
}

function maskFrontmatter(text: string): string {
  const m = /^(\uFEFF?\s*)---\r?\n[\s\S]*?\n---[^\S\n]*(?=\r?\n|$)/.exec(text);
  return m ? keepNewlines(m[0], " ") + text.slice(m[0].length) : text;
}

/** `[attr.aria-label]="x"` → `aria-label="x"` (misma longitud). */
function normalizeAngularBindings(text: string): string {
  return text
    .replace(
      /([\s<])\[(?:attr\.)?([A-Za-z][\w-]*)\](?==)/g,
      (all, pre: string, name: string) => pre + name.padEnd(all.length - pre.length, " "),
    )
    .replace(/(\s)bind-([A-Za-z][\w-]*)(?==)/g, (all, pre: string, name: string) =>
      (pre + name).padEnd(all.length, " "),
    );
}

const RAW_TEXT = /^(script|style|textarea)$/i;

function maskBraces(text: string): string {
  const out = text.split("");
  const fill = (from: number, to: number, ch: string): void => {
    for (let k = from; k <= to; k++) if (out[k] !== "\n") out[k] = ch;
  };
  let i = 0;
  while (i < text.length) {
    // Comentarios HTML: se respetan tal cual.
    if (text.startsWith("<!--", i)) {
      const end = text.indexOf("-->", i + 4);
      i = end < 0 ? text.length : end + 3;
      continue;
    }
    const tag = /^<([A-Za-z][\w:.-]*)/.exec(text.slice(i, i + 64));
    if (tag?.[1]) {
      // Dentro de una etiqueta: se recorre hasta `>` fuera de comillas y llaves.
      let j = i + tag[0].length;
      while (j < text.length && text[j] !== ">") {
        const c = text[j];
        if (c === '"' || c === "'") {
          const close = text.indexOf(c, j + 1);
          j = close < 0 ? text.length : close + 1;
          continue;
        }
        if (c === "{") {
          const close = matchBrace(text, j);
          if (close < 0) break;
          const inner = text.slice(j + 1, close).trim();
          if (text[j - 1] === "=") {
            out[j] = '"';
            out[close] = '"';
            const literal = /^\s*(-?\d+(?:\.\d+)?|"[^"\n]*"|'[^'\n]*')\s*$/.test(inner);
            // Literales (`tabindex={3}`, `alt={"Logo"}`) conservan su valor; el resto
            // es dinámico y se rellena.
            if (literal) {
              for (let k = j + 1; k < close; k++) if (/["'`]/.test(out[k]!)) out[k] = " ";
            } else {
              fill(j + 1, close - 1, "x");
            }
          } else if (/^[A-Za-z_$][\w$-]*$/.test(inner)) {
            // Atajo `{alt}`: el atributo existe.
            fill(j, close, " ");
            const start = text.indexOf(inner, j);
            for (let k = 0; k < inner.length; k++) out[start + k] = inner[k]!;
          } else {
            fill(j, close, " ");
          }
          j = close + 1;
          continue;
        }
        j++;
      }
      i = j + 1;
      if (RAW_TEXT.test(tag[1]) && text[j - 1] !== "/") {
        const end = text.toLowerCase().indexOf(`</${tag[1].toLowerCase()}`, i);
        i = end < 0 ? text.length : end;
      }
      continue;
    }
    if (text[i] === "{") {
      const close = matchBrace(text, i);
      if (close > 0) {
        fill(i, close, "_");
        i = close + 1;
        continue;
      }
    }
    i++;
  }
  return out.join("");
}

export function maskTemplate(text: string, flavor: TemplateFlavor): string {
  switch (flavor) {
    case "svelte":
      return maskBraces(text);
    case "astro":
      return maskBraces(maskFrontmatter(text));
    case "html":
      return normalizeAngularBindings(text);
  }
}
