import { matchBrace } from "../linter/templates";
import type { FixEdit, FixSuggestion } from "./types";

/**
 * Quick fixes para plantillas que no son JSX (Vue, HTML, Svelte, Astro, Angular).
 * Trabajan sobre el texto de la etiqueta de apertura, sin AST: solo insertan,
 * reemplazan o quitan un atributo. Si algo no está claro, no ofrecen nada.
 */
interface Attr {
  name: string;
  start: number;
  end: number;
  /** Rango del valor sin comillas, si lo tiene. */
  value?: { start: number; end: number };
}

interface Tag {
  name: string;
  start: number;
  /** Fin del nombre: donde se inserta un atributo nuevo. */
  nameEnd: number;
  end: number;
  attrs: Attr[];
}

/** Etiqueta de apertura que contiene `offset` (o empieza en él). */
export function tagAt(text: string, offset: number): Tag | undefined {
  let start = offset;
  while (start >= 0 && !(text[start] === "<" && /[A-Za-z]/.test(text[start + 1] ?? ""))) {
    if (text[start] === ">" && start !== offset) return undefined;
    start--;
  }
  if (start < 0) return undefined;
  const name = /^<([A-Za-z][\w:.-]*)/.exec(text.slice(start, start + 64))?.[1];
  if (!name) return undefined;
  const nameEnd = start + 1 + name.length;
  const attrs: Attr[] = [];
  const nameRe = /\s+([^\s=/>"'{]+)/y;
  let i = nameEnd;
  for (;;) {
    nameRe.lastIndex = i;
    const m = nameRe.exec(text);
    if (!m?.[1]) break;
    const attr: Attr = { name: m[1], start: nameRe.lastIndex - m[1].length, end: nameRe.lastIndex };
    i = nameRe.lastIndex;
    const eq = /^\s*=\s*/.exec(text.slice(i, i + 32));
    if (eq) {
      const v = i + eq[0].length;
      const c = text[v];
      let valueEnd: number;
      if (c === '"' || c === "'") {
        valueEnd = text.indexOf(c, v + 1);
        if (valueEnd < 0) return undefined;
        attr.value = { start: v + 1, end: valueEnd };
        valueEnd++;
      } else if (c === "{") {
        // Svelte / Astro: alt={expresión}.
        valueEnd = matchBrace(text, v);
        if (valueEnd < 0) return undefined;
        attr.value = { start: v, end: valueEnd + 1 };
        valueEnd++;
      } else {
        const bare = /^[^\s>"']+/.exec(text.slice(v));
        if (!bare) return undefined;
        valueEnd = v + bare[0].length;
        attr.value = { start: v, end: valueEnd };
      }
      attr.end = valueEnd;
      i = valueEnd;
    }
    attrs.push(attr);
  }
  const close = /^\s*\/?>/.exec(text.slice(i));
  if (!close) return undefined;
  return { name: name.toLowerCase(), start, nameEnd, end: i + close[0].length, attrs };
}

/** Nombre del atributo sin prefijos de binding (`:alt`, `v-bind:alt`, `[alt]`). */
function baseName(name: string): string {
  return name
    .replace(/^(v-bind:|:|bind:)/, "")
    .replace(/^\[(?:attr\.)?(.+)\]$/, "$1")
    .toLowerCase();
}

const find = (tag: Tag, name: string) => tag.attrs.find((a) => baseName(a.name) === name);
const hasSpread = (tag: Tag) => tag.attrs.some((a) => /^(v-bind|\.\.\.)$/.test(a.name));
const insert = (tag: Tag, newText: string): FixEdit[] => [
  { start: tag.nameEnd, end: tag.nameEnd, newText },
];

function altText(tag: Tag): FixSuggestion[] {
  if (tag.name !== "img" || find(tag, "alt") || hasSpread(tag)) return [];
  return [
    { title: 'Marcar la imagen como decorativa (alt="")', edits: insert(tag, ' alt=""') },
    {
      title: 'Agregar alt="TODO: describe lo que muestra"',
      edits: insert(tag, ' alt="TODO: describe lo que muestra"'),
    },
  ];
}

function htmlHasLang(tag: Tag): FixSuggestion[] {
  if (tag.name !== "html" || find(tag, "lang")) return [];
  return [{ title: 'Agregar lang="es" a <html>', edits: insert(tag, ' lang="es"') }];
}

function tabindexNoPositive(tag: Tag, text: string): FixSuggestion[] {
  const attr = find(tag, "tabindex");
  if (!attr?.value) return [];
  // Respeta la forma del valor: "2" → "0", {2} → {0}.
  const braced = text[attr.value.start] === "{";
  return [
    {
      title: braced ? "Reemplazar por tabindex={0}" : 'Reemplazar por tabindex="0"',
      preferred: true,
      edits: [{ start: attr.value.start, end: attr.value.end, newText: braced ? "{0}" : "0" }],
    },
  ];
}

function noAutofocus(tag: Tag, text: string): FixSuggestion[] {
  const attr = find(tag, "autofocus");
  if (!attr) return [];
  let start = attr.start;
  while (start > 0 && /\s/.test(text.charAt(start - 1))) start--;
  return [
    { title: "Quitar autofocus", preferred: true, edits: [{ start, end: attr.end, newText: "" }] },
  ];
}

/** `canonicalRuleId` es el id de la explicación (p. ej. `jsx-a11y/alt-text`). */
export function markupFixes(
  canonicalRuleId: string,
  text: string,
  offset: number,
): FixSuggestion[] {
  const tag = tagAt(text, offset);
  if (!tag) return [];
  switch (canonicalRuleId) {
    case "jsx-a11y/alt-text":
      return altText(tag);
    case "jsx-a11y/html-has-lang":
      return htmlHasLang(tag);
    case "jsx-a11y/tabindex-no-positive":
      return tabindexNoPositive(tag, text);
    case "jsx-a11y/no-autofocus":
      return noAutofocus(tag, text);
    default:
      return [];
  }
}
