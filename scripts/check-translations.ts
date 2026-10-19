/**
 * Falla si alguna regla de eslint-plugin-jsx-a11y no tiene ni traducción ni
 * marca explícita de "pendiente", o si alguna traducción es inválida.
 *
 *   npm run check:translations
 */
import jsxA11y from "eslint-plugin-jsx-a11y";
import { isPending, listExplanations } from "../src/i18n";

const MAX_MENSAJE = 90;
const pluginRules = Object.keys(jsxA11y.rules ?? {}).map((r) => `jsx-a11y/${r}`);
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

for (const t of translations) {
  const where = t.ruleId;
  if (!pluginRules.includes(t.ruleId)) errors.push(`${where}: la regla no existe en el plugin`);
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
  `Reglas del plugin: ${pluginRules.length} · traducidas: ${translated.size} · pendientes: ${pending}`,
);
if (errors.length) {
  console.error("\n" + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("check-translations: OK");
