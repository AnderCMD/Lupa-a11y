/**
 * Falla si alguna regla de eslint-plugin-jsx-a11y no tiene ni traducción ni
 * marca explícita de "pendiente", si alguna regla activa de Vue o HTML no tiene
 * explicación (propia o por alias), o si alguna traducción es inválida.
 *
 *   npm run check:translations
 */
import htmlPlugin from "@html-eslint/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import { ALIASES, getExplanation, isPending, listExplanations } from "../src/i18n";
import { HTML_A11Y_RULES } from "../src/linter/flavors";

const MAX_MENSAJE = 90;
const pluginRules = Object.keys(jsxA11y.rules ?? {}).map((r) => `jsx-a11y/${r}`);
const vueRules = Object.keys(vueA11y.rules ?? {})
  .filter((r) => r !== "no-onchange")
  .map((r) => `vuejs-accessibility/${r}`);
const htmlRules = HTML_A11Y_RULES.map((r) => `@html-eslint/${r}`);
const knownRules = new Set([...pluginRules, ...vueRules, ...htmlRules]);
const translations = listExplanations("es");
const translated = new Set(translations.map((t) => t.ruleId));
const errors: string[] = [];

for (const id of pluginRules) {
  if (!translated.has(id) && !isPending(id)) {
    errors.push(`${id}: sin traducción y sin marca de pendiente`);
  }
  if (translated.has(id) && isPending(id)) {
    errors.push(`${id}: está traducida pero sigue marcada como pendiente`);
  }
}

for (const id of [...vueRules, ...htmlRules]) {
  if (!getExplanation(id)) errors.push(`${id}: regla activa sin explicación ni alias`);
}
for (const name of HTML_A11Y_RULES) {
  if (!(htmlPlugin.rules as Record<string, unknown>)[name]) {
    errors.push(`@html-eslint/${name}: la regla no existe en el plugin`);
  }
}
for (const [from, to] of Object.entries(ALIASES)) {
  if (!knownRules.has(from)) errors.push(`${from}: alias de una regla que no existe`);
  if (!translated.has(to))
    errors.push(`${from}: el alias apunta a ${to}, que no tiene explicación`);
}

for (const t of translations) {
  const where = t.ruleId;
  if (!knownRules.has(t.ruleId)) errors.push(`${where}: la regla no existe en el plugin`);
  for (const k of ["titulo", "mensaje", "porQueImporta", "malEjemplo", "bienEjemplo"] as const) {
    if (!t[k].trim()) errors.push(`${where}: campo vacío ${k}`);
  }
  if (t.mensaje.length > MAX_MENSAJE) {
    errors.push(`${where}: mensaje de ${t.mensaje.length} caracteres (máx. ${MAX_MENSAJE})`);
  }
  if (t.afectados.length === 0) errors.push(`${where}: afectados vacío`);
  if (!t.wcag.url.startsWith("https://www.w3.org/"))
    errors.push(`${where}: wcag.url no apunta a w3.org`);
  if (!t.wcag.criterio.trim()) errors.push(`${where}: wcag.criterio vacío`);
}

const pending = pluginRules.filter((id) => isPending(id)).length;
console.log(
  `jsx-a11y: ${pluginRules.length} reglas · pendientes: ${pending} · Vue: ${vueRules.length} · HTML: ${htmlRules.length} · explicaciones: ${translated.size} · alias: ${Object.keys(ALIASES).length}`,
);
if (errors.length) {
  console.error("\n" + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("check-translations: OK");
