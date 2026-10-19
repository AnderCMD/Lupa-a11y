import { parse } from "@typescript-eslint/parser";

/** Nodo ESTree mínimo; solo lo necesario para localizar elementos JSX. */
export interface Node {
  type: string;
  range: [number, number];
  [key: string]: unknown;
}

export interface Target {
  element: Node;
  opening: Node;
  /** Presente cuando el diagnóstico apunta a un atributo concreto. */
  attr?: Node;
}

export function parseJsx(text: string): Node | undefined {
  try {
    return parse(text, {
      ecmaFeatures: { jsx: true },
      range: true,
      sourceType: "module",
    }) as unknown as Node;
  } catch {
    return undefined;
  }
}

export function asNode(value: unknown): Node | undefined {
  return value !== null && typeof value === "object" && typeof (value as Node).type === "string"
    ? (value as Node)
    : undefined;
}

const SKIP_KEYS = new Set(["parent", "range", "loc", "tokens", "comments"]);

/**
 * Localiza el elemento (o atributo) JSX que empieza exactamente en `offset`.
 * ESLint reporta el `JSXOpeningElement` o el `JSXAttribute`, según la regla.
 */
export function findTarget(root: Node, offset: number): Target | undefined {
  let found: Target | undefined;
  const visit = (value: unknown, element?: Node): void => {
    if (found || value === null || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item, element);
      return;
    }
    const node = asNode(value);
    if (!node) return;
    const current = node.type === "JSXElement" ? node : element;
    const opening = asNode(current?.openingElement);
    if (current && opening) {
      if (node.type === "JSXOpeningElement" && node.range[0] === offset) {
        found = { element: current, opening: node };
        return;
      }
      if (node.type === "JSXAttribute" && node.range[0] === offset) {
        found = { element: current, opening, attr: node };
        return;
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (!SKIP_KEYS.has(key)) visit(child, current);
    }
  };
  visit(root);
  return found;
}

export function attributes(opening: Node): Node[] {
  return (opening.attributes as Node[] | undefined) ?? [];
}

export function hasSpread(opening: Node): boolean {
  return attributes(opening).some((a) => a.type === "JSXSpreadAttribute");
}

export function attrName(attr: Node): string | undefined {
  const name = asNode(attr.name);
  return attr.type === "JSXAttribute" && name?.type === "JSXIdentifier"
    ? (name.name as string)
    : undefined;
}

export function getAttr(opening: Node, name: string): Node | undefined {
  return attributes(opening).find((a) => attrName(a) === name);
}

export function elementName(opening: Node): string | undefined {
  const name = asNode(opening.name);
  return name?.type === "JSXIdentifier" ? (name.name as string) : undefined;
}

/** Offset donde insertar un atributo nuevo: tras el último atributo o el nombre. */
export function attrInsertOffset(opening: Node): number {
  const last = attributes(opening).at(-1);
  if (last) return last.range[1];
  return (asNode(opening.name) as Node).range[1];
}
