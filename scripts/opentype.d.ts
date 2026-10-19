declare module "opentype.js" {
  export interface Path {
    toPathData(decimalPlaces?: number): string;
  }
  export interface Glyph {
    advanceWidth: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }
  export interface Font {
    unitsPerEm: number;
    charToGlyph(char: string): Glyph;
    getKerningValue(left: Glyph, right: Glyph): number;
  }
  export function parse(buffer: ArrayBuffer): Font;
}
