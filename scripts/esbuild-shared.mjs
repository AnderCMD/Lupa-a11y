/**
 * Ajustes de esbuild que necesitan las dependencias de los presets de Vue y HTML.
 * Los usan `esbuild.mjs` (extensión) y `test/bundle.test.ts`.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** @type {import("esbuild").Plugin} */
const stubVueLegacyConfig = {
  name: "stub-vue-a11y-legacy-config",
  setup(build) {
    // `configs/recommended.js` de vuejs-accessibility llama a
    // `require.resolve("vue-eslint-parser")` al cargarse; en el .vsix no hay
    // node_modules y fallaría. Lupa no usa esa config (eslintrc): se sustituye.
    build.onResolve({ filter: /^\.\/configs\/recommended$/ }, (args) =>
      args.importer.includes("eslint-plugin-vuejs-accessibility")
        ? { path: "vue-a11y-legacy-config", namespace: "lupa-stub" }
        : undefined,
    );
    build.onLoad({ filter: /.*/, namespace: "lupa-stub" }, () => ({
      contents: "module.exports = { default: {} };",
      loader: "js",
    }));
  },
};

/** @type {Pick<import("esbuild").BuildOptions, "alias" | "plugins" | "absWorkingDir">} */
export const sharedBundleOptions = {
  absWorkingDir: root,
  // La versión UMD de vscode-css-languageservice (dependencia de @html-eslint) usa
  // `require` dinámicos que esbuild no puede seguir: se usa su versión ESM.
  alias: {
    "vscode-css-languageservice":
      "./node_modules/vscode-css-languageservice/lib/esm/cssLanguageService.js",
  },
  plugins: [stubVueLegacyConfig],
};
