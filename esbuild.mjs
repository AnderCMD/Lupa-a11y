import { build, context } from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");
const tests = process.argv.includes("--tests");

/** @type {import("esbuild").BuildOptions} */
const options = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/extension.js",
  platform: "node",
  format: "cjs",
  target: "node20",
  external: ["vscode", "jiti"],
  sourcemap: !production,
  minify: production,
  logLevel: "info",
};

if (tests) {
  // Suite de integración que se ejecuta dentro de VS Code (@vscode/test-electron).
  await build({
    ...options,
    entryPoints: ["test/integration/suite.ts"],
    outfile: "dist-test/suite.js",
    sourcemap: false,
    minify: false,
  });
} else if (watch) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build(options);
}
