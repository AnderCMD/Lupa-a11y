import * as tsParser from "@typescript-eslint/parser";
import { Linter } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export interface LintMessage {
  ruleId: string;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}

const linter = new Linter({ configType: "flat" });

/** Preset incluido: solo reglas jsx-a11y/*. */
function presetConfig(): Linter.Config[] {
  const rules: Linter.RulesRecord = {};
  for (const [id, entry] of Object.entries(jsxA11y.flatConfigs.recommended.rules ?? {})) {
    if (id.startsWith("jsx-a11y/") && entry !== undefined) rules[id] = entry;
  }
  // Ajustes sobre `recommended`: palabras redundantes en español y una regla
  // que `recommended` trae desactivada.
  rules["jsx-a11y/img-redundant-alt"] = [
    "error",
    { words: ["imagen", "foto", "fotografía", "fotografia"] },
  ];
  // Reglas útiles que `recommended` no activa. `words` reemplaza la lista por
  // defecto (en inglés), así que se incluyen también las inglesas.
  rules["jsx-a11y/anchor-ambiguous-text"] = [
    "error",
    {
      words: [
        "click here",
        "here",
        "link",
        "a link",
        "learn more",
        "clic aquí",
        "haz clic aquí",
        "aquí",
        "enlace",
        "un enlace",
        "más información",
        "leer más",
        "ver más",
        "más",
      ],
    },
  ];
  rules["jsx-a11y/lang"] = "error";
  rules["jsx-a11y/no-aria-hidden-on-focusable"] = "error";
  const controlLabel =
    jsxA11y.flatConfigs.recommended.rules?.["jsx-a11y/control-has-associated-label"];
  if (Array.isArray(controlLabel)) {
    rules["jsx-a11y/control-has-associated-label"] = ["error", ...controlLabel.slice(1)];
  }
  return [
    {
      files: ["**/*.jsx", "**/*.tsx"],
      plugins: { "jsx-a11y": jsxA11y },
      languageOptions: {
        parser: tsParser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      linterOptions: { reportUnusedDisableDirectives: "off" },
      rules,
    },
  ];
}

const config = presetConfig();

/**
 * Conserva solo los mensajes de jsx-a11y/*. Los errores de sintaxis (mensajes
 * fatales) se ignoran en silencio y devuelven lista vacía.
 */
export function toLintMessages(messages: readonly Linter.LintMessage[]): LintMessage[] {
  if (messages.some((m) => m.fatal)) return [];
  const out: LintMessage[] = [];
  for (const m of messages) {
    if (!m.ruleId?.startsWith("jsx-a11y/")) continue;
    out.push({
      ruleId: m.ruleId,
      message: m.message,
      line: m.line,
      column: m.column,
      endLine: m.endLine,
      endColumn: m.endColumn,
    });
  }
  return out;
}

/**
 * Nombre virtual para el Linter en memoria: solo importa la extensión (debe
 * coincidir con `files` del preset). Se deduce del idioma del editor y no del
 * nombre real, que puede ser "Untitled-1" o un `.js` con JSX.
 */
export function virtualFilename(filename: string, languageId?: string): string {
  if (languageId === "javascriptreact") return "file.jsx";
  if (languageId === "typescriptreact") return "file.tsx";
  return filename.toLowerCase().endsWith(".jsx") ? "file.jsx" : "file.tsx";
}

/** Analiza el texto con el preset incluido. */
export function runEslint(text: string, filename: string, languageId?: string): LintMessage[] {
  return toLintMessages(
    linter.verify(text, config, { filename: virtualFilename(filename, languageId) }),
  );
}
