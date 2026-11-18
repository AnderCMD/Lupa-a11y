/**
 * Construye la librería `lupa-a11y-core` en `dist-lib/` (ESM + CJS + tipos) con su
 * propio package.json. Se publica con `npm publish ./dist-lib`.
 *
 *   npm run build:lib
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";

const root = join(__dirname, "..");
const out = join(root, "dist-lib");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  version: string;
  license: string;
  keywords: string[];
  devDependencies: Record<string, string>;
};

async function main(): Promise<void> {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const common = {
    entryPoints: [join(root, "src/lib.ts")],
    bundle: true,
    platform: "node" as const,
    target: "node20",
    // Dependencias reales de la librería: no se empaquetan.
    external: [
      "eslint",
      "eslint-plugin-jsx-a11y",
      "@typescript-eslint/parser",
      "eslint-plugin-vuejs-accessibility",
      "vue-eslint-parser",
      "@html-eslint/eslint-plugin",
      "globals",
      "jiti",
    ],
    logLevel: "warning" as const,
  };
  await build({ ...common, format: "cjs", outfile: join(out, "index.cjs") });
  await build({ ...common, format: "esm", outfile: join(out, "index.mjs") });
  await build({
    ...common,
    entryPoints: [join(root, "src/bin.ts")],
    format: "cjs",
    outfile: join(out, "cli.cjs"),
    banner: { js: "#!/usr/bin/env node" },
  });

  execFileSync(
    process.execPath,
    [join(root, "node_modules/typescript/bin/tsc"), "-p", join(root, "tsconfig.lib.json")],
    { stdio: "inherit" },
  );

  const dep = (name: string) => pkg.devDependencies[name] ?? "*";
  const manifest = {
    name: "lupa-a11y-core",
    version: pkg.version,
    description:
      "Núcleo y CLI de Lupa A11y: linter de accesibilidad para React, Vue, Svelte, Astro, Angular y HTML con explicaciones en español (sin dependencias de VS Code)",
    license: pkg.license,
    author: "AnderCMD",
    repository: { type: "git", url: "git+https://github.com/AnderCMD/Lupa-a11y.git" },
    bugs: { url: "https://github.com/AnderCMD/Lupa-a11y/issues" },
    homepage: "https://github.com/AnderCMD/Lupa-a11y#readme",
    keywords: [...pkg.keywords, "eslint", "jsx-a11y", "cli"],
    main: "./index.cjs",
    module: "./index.mjs",
    types: "./types/lib.d.ts",
    // Sin "./": npm 11 descarta en silencio un bin con esa forma al publicar.
    bin: { "lupa-a11y": "cli.cjs" },
    exports: {
      ".": {
        types: "./types/lib.d.ts",
        import: "./index.mjs",
        require: "./index.cjs",
      },
      "./package.json": "./package.json",
    },
    files: ["index.cjs", "index.mjs", "cli.cjs", "types", "README.md", "LICENSE", "NOTICE"],
    engines: { node: ">=20" },
    sideEffects: false,
    dependencies: {
      "@typescript-eslint/parser": dep("@typescript-eslint/parser"),
      "eslint-plugin-jsx-a11y": dep("eslint-plugin-jsx-a11y"),
      "eslint-plugin-vuejs-accessibility": dep("eslint-plugin-vuejs-accessibility"),
      "vue-eslint-parser": dep("vue-eslint-parser"),
      "@html-eslint/eslint-plugin": dep("@html-eslint/eslint-plugin"),
      // Peer de vuejs-accessibility (lo carga su config flat al importarse).
      globals: dep("globals"),
    },
    peerDependencies: { eslint: "^9.0.0" },
  };
  writeFileSync(join(out, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
  copyFileSync(join(__dirname, "lib-README.md"), join(out, "README.md"));
  copyFileSync(join(root, "LICENSE"), join(out, "LICENSE"));
  copyFileSync(join(root, "NOTICE"), join(out, "NOTICE"));
  console.log(`lupa-a11y-core@${pkg.version} listo en dist-lib/`);
}

void main();
