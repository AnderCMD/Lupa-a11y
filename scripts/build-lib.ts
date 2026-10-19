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
    external: ["eslint", "eslint-plugin-jsx-a11y", "@typescript-eslint/parser", "jiti"],
    logLevel: "warning" as const,
  };
  await build({ ...common, format: "cjs", outfile: join(out, "index.cjs") });
  await build({ ...common, format: "esm", outfile: join(out, "index.mjs") });

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
      "Núcleo de Lupa A11y: linter de accesibilidad para JSX/TSX con explicaciones en español (sin dependencias de VS Code)",
    license: pkg.license,
    author: "AnderCMD",
    repository: { type: "git", url: "git+https://github.com/AnderCMD/Lupa-a11y.git" },
    bugs: { url: "https://github.com/AnderCMD/Lupa-a11y/issues" },
    homepage: "https://github.com/AnderCMD/Lupa-a11y#readme",
    keywords: [...pkg.keywords, "eslint", "wcag", "jsx-a11y"],
    main: "./index.cjs",
    module: "./index.mjs",
    types: "./types/lib.d.ts",
    exports: {
      ".": {
        types: "./types/lib.d.ts",
        import: "./index.mjs",
        require: "./index.cjs",
      },
      "./package.json": "./package.json",
    },
    files: ["index.cjs", "index.mjs", "types", "README.md", "LICENSE"],
    engines: { node: ">=20" },
    sideEffects: false,
    dependencies: {
      "@typescript-eslint/parser": dep("@typescript-eslint/parser"),
      "eslint-plugin-jsx-a11y": dep("eslint-plugin-jsx-a11y"),
    },
    peerDependencies: { eslint: "^9.0.0" },
  };
  writeFileSync(join(out, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
  copyFileSync(join(__dirname, "lib-README.md"), join(out, "README.md"));
  copyFileSync(join(root, "LICENSE"), join(out, "LICENSE"));
  console.log(`lupa-a11y-core@${pkg.version} listo en dist-lib/`);
}

void main();
