import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "dist-test/**",
      "dist-lib/**",
      "node_modules/**",
      ".vscode-test/**",
      "test/fixtures/**",
      "assets/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.mjs"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // `require` se usa a propósito en tests y scripts (CJS vía tsx/vitest).
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
