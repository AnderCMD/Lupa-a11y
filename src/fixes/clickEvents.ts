import { asNode, attrInsertOffset, elementName, getAttr, hasSpread } from "./ast";
import type { Node, Target } from "./ast";
import type { FixSuggestion } from "./types";

const PHRASING = new Set([
  "span",
  "strong",
  "em",
  "b",
  "i",
  "small",
  "code",
  "abbr",
  "mark",
  "img",
  "svg",
]);

/** Un <button> solo admite contenido "de línea": evita romper el HTML. */
function hasSimpleChildren(element: Node): boolean {
  const children = (element.children as unknown[] | undefined) ?? [];
  return children.every((c) => {
    const child = asNode(c);
    if (!child) return false;
    if (child.type === "JSXText" || child.type === "JSXExpressionContainer") {
      return true;
    }
    if (child.type !== "JSXElement") return false;
    const name = elementName(asNode(child.openingElement) as Node);
    return name !== undefined && PHRASING.has(name);
  });
}

const KEY_HANDLER =
  ' role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}';

/** Para `click-events-have-key-events` y `no-static-element-interactions`. */
export function clickEventsFixes({ element, opening, attr }: Target): FixSuggestion[] {
  if (attr || hasSpread(opening) || !getAttr(opening, "onClick")) return [];
  const name = elementName(opening);
  const fixes: FixSuggestion[] = [];

  const closing = asNode(element.closingElement);
  const openName = asNode(opening.name);
  const closeName = asNode(closing?.name);
  if (
    (name === "div" || name === "span") &&
    openName &&
    closeName &&
    !getAttr(opening, "role") &&
    !getAttr(opening, "type") &&
    hasSimpleChildren(element)
  ) {
    fixes.push({
      title: "Convertir en <button>",
      preferred: true,
      edits: [
        { start: openName.range[0], end: openName.range[1], newText: 'button type="button"' },
        { start: closeName.range[0], end: closeName.range[1], newText: "button" },
      ],
    });
  }

  if (
    !getAttr(opening, "role") &&
    !getAttr(opening, "tabIndex") &&
    !getAttr(opening, "onKeyDown")
  ) {
    const at = attrInsertOffset(opening);
    fixes.push({
      title: "Agregar role, tabIndex y onKeyDown (Enter y Espacio)",
      edits: [{ start: at, end: at, newText: KEY_HANDLER }],
    });
  }
  return fixes;
}
