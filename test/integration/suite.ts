import * as assert from "node:assert";
import * as vscode from "vscode";

const CODE = `export const Foto = () => <img src="x.png" />;\n`;

async function until<T>(read: () => T | undefined, what: string, timeoutMs = 20000): Promise<T> {
  const start = Date.now();
  for (;;) {
    const value = read();
    if (value !== undefined) return value;
    if (Date.now() - start > timeoutMs) throw new Error(`Tiempo agotado esperando: ${what}`);
    await new Promise((r) => setTimeout(r, 100));
  }
}

const lupaDiagnostics = (uri: vscode.Uri) =>
  vscode.languages.getDiagnostics(uri).filter((d) => d.source === "Lupa A11y");

const tests: { name: string; run: () => Promise<void> }[] = [];
const test = (name: string, run: () => Promise<void>) => tests.push({ name, run });

let doc: vscode.TextDocument;

test("activa la extensión al abrir un .tsx", async () => {
  doc = await vscode.workspace.openTextDocument({ language: "typescriptreact", content: CODE });
  await vscode.window.showTextDocument(doc);
  const ext = vscode.extensions.getExtension("AnderCMD.lupa-a11y");
  assert.ok(ext, "la extensión no está instalada");
  await until(() => (ext.isActive ? true : undefined), "activación");
});

test("muestra el diagnóstico en español", async () => {
  const [d] = await until(() => {
    const found = lupaDiagnostics(doc.uri);
    return found.length ? found : undefined;
  }, "diagnóstico de alt-text");
  assert.ok(d);
  assert.match(d.message, /atributo alt/);
  assert.strictEqual(d.source, "Lupa A11y");
  assert.strictEqual(typeof d.code === "object" ? d.code.value : d.code, "jsx-a11y/alt-text");
  assert.strictEqual(d.severity, vscode.DiagnosticSeverity.Warning);
});

test("el hover explica el problema", async () => {
  const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
    "vscode.executeHoverProvider",
    doc.uri,
    new vscode.Position(0, 30),
  );
  const text = hovers
    .flatMap((h) => h.contents)
    .map((c) => (typeof c === "string" ? c : c.value))
    .join("\n");
  assert.match(text, /Imagen sin texto alternativo/);
  assert.match(text, /Ver explicación completa/);
});

test("ofrece un quick fix que resuelve el problema", async () => {
  const [d] = lupaDiagnostics(doc.uri);
  assert.ok(d);
  const actions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
    "vscode.executeCodeActionProvider",
    doc.uri,
    d.range,
    vscode.CodeActionKind.QuickFix.value,
  );
  const titles = actions.map((a) => a.title);
  assert.ok(titles.includes("Ver explicación"), `acciones: ${titles.join(" | ")}`);
  const fix = actions.find((a) => a.title === 'Marcar la imagen como decorativa (alt="")');
  assert.ok(fix?.edit, `acciones: ${titles.join(" | ")}`);
  assert.ok(await vscode.workspace.applyEdit(fix.edit));
  assert.match(doc.getText(), /alt=""/);
  await until(
    () => (lupaDiagnostics(doc.uri).length === 0 ? true : undefined),
    "diagnóstico resuelto",
  );
});

export async function run(): Promise<void> {
  for (const t of tests) {
    try {
      await t.run();
      console.log(`  ✓ ${t.name}`);
    } catch (error) {
      throw new Error(`✗ ${t.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
