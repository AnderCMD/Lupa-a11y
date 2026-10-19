/**
 * Lanza VS Code con la extensión y ejecuta la suite de integración.
 * En local puedes usar tu VS Code instalado:
 *   VSCODE_TEST_EXECUTABLE="/Applications/Visual Studio Code.app/Contents/MacOS/Code" npm run test:integration
 * Sin esa variable, @vscode/test-electron descarga VS Code (lo que hace la CI).
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
  const root = resolve(__dirname, "../..");
  const scratch = mkdtempSync(join(tmpdir(), "lupa-vscode-test-"));
  await runTests({
    vscodeExecutablePath: process.env.VSCODE_TEST_EXECUTABLE || undefined,
    extensionDevelopmentPath: root,
    extensionTestsPath: join(root, "dist-test", "suite.js"),
    launchArgs: [
      "--disable-extensions",
      "--disable-workspace-trust",
      `--user-data-dir=${join(scratch, "user")}`,
      `--extensions-dir=${join(scratch, "ext")}`,
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
