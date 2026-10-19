import type { RuleExplanation } from "../i18n/types";

export const SHOW_EXPLANATION_COMMAND = "lupaA11y.showExplanation";

export function explanationCommandUri(ruleId: string): string {
  return `command:${SHOW_EXPLANATION_COMMAND}?${encodeURIComponent(JSON.stringify([ruleId]))}`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Texto plano que puede contener `<button>` y similares → Markdown seguro. */
function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_{}[\]<>])/g, "\\$1");
}

function nivelTexto(e: RuleExplanation): string {
  return e.wcag.nivel === "buena práctica" ? "Buena práctica" : `Nivel ${e.wcag.nivel}`;
}

/** Contenido del hover (Markdown). */
export function renderHoverMarkdown(e: RuleExplanation): string {
  return [
    `**${escapeMarkdown(e.titulo)}**`,
    "",
    escapeMarkdown(e.porQueImporta),
    "",
    "Mal:",
    "```tsx",
    e.malEjemplo,
    "```",
    "Bien:",
    "```tsx",
    e.bienEjemplo,
    "```",
    `[WCAG ${escapeMarkdown(e.wcag.criterio)} (${nivelTexto(e)})](${e.wcag.url}) · [Ver explicación completa](${explanationCommandUri(e.ruleId)})`,
  ].join("\n");
}

/**
 * Resaltado mínimo de JSX con clases CSS (sin scripts ni recursos externos).
 * Escapa todo el texto antes de insertarlo en el HTML.
 */
export function highlightJsx(code: string): string {
  const token = /(<\/?)([A-Za-z][\w.]*)|("[^"]*"|'[^']*'|`[^`]*`)|([A-Za-z_][\w-]*)(?==)|([{}])/g;
  let out = "";
  let last = 0;
  for (const m of code.matchAll(token)) {
    out += escapeHtml(code.slice(last, m.index));
    if (m[2] !== undefined) {
      out += `${escapeHtml(m[1] ?? "")}<span class="tk-tag">${escapeHtml(m[2])}</span>`;
    } else if (m[3] !== undefined) {
      out += `<span class="tk-str">${escapeHtml(m[3])}</span>`;
    } else if (m[4] !== undefined) {
      out += `<span class="tk-attr">${escapeHtml(m[4])}</span>`;
    } else {
      out += `<span class="tk-punct">${escapeHtml(m[5] ?? "")}</span>`;
    }
    last = (m.index ?? 0) + m[0].length;
  }
  return out + escapeHtml(code.slice(last));
}

export interface PanelOptions {
  cspSource: string;
  logoUri: string;
  nonce: string;
}

const STYLES = `
  body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size);
    color: var(--vscode-foreground); background: var(--vscode-editor-background);
    max-width: 46rem; margin: 0 auto; padding: 1.25rem 1.5rem 2.5rem; line-height: 1.55; }
  header.brand { display: flex; align-items: center; gap: .5rem; margin-bottom: 1rem;
    color: var(--vscode-descriptionForeground); font-size: .9em; }
  header.brand img { width: 20px; height: 20px; }
  h1 { font-size: 1.5em; margin: .2rem 0 .6rem; }
  h2 { font-size: 1.05em; margin: 1.5rem 0 .4rem; }
  .badge { display: inline-block; padding: .1rem .6rem; border-radius: 999px;
    border: 1px solid var(--vscode-focusBorder); font-size: .85em; }
  pre { background: var(--vscode-textCodeBlock-background); padding: .75rem 1rem;
    border-radius: 4px; overflow-x: auto; margin: .3rem 0; }
  pre, code { font-family: var(--vscode-editor-font-family, monospace); font-size: var(--vscode-editor-font-size, 13px); }
  .ejemplo { border-left: 4px solid var(--vscode-editorWidget-border, currentColor); padding-left: .75rem; margin: 1rem 0; }
  .ejemplo.mal { border-left-color: var(--vscode-editorError-foreground); }
  .ejemplo.bien { border-left-color: var(--vscode-testing-iconPassed, var(--vscode-editorInfo-foreground)); }
  .ejemplo h2 { margin-top: 0; }
  a { color: var(--vscode-textLink-foreground); }
  a:focus-visible { outline: 2px solid var(--vscode-focusBorder); outline-offset: 2px; }
  ul { padding-left: 1.25rem; }
  .tk-tag { color: var(--vscode-symbolIcon-classForeground, var(--vscode-textLink-foreground)); }
  .tk-attr { color: var(--vscode-symbolIcon-propertyForeground, inherit); }
  .tk-str { color: var(--vscode-symbolIcon-stringForeground, inherit); }
  .tk-punct { color: var(--vscode-descriptionForeground); }
`;

/** HTML completo del panel "Ver explicación". Sin scripts; CSP estricta. */
export function renderPanelHtml(e: RuleExplanation, o: PanelOptions): string {
  const csp = ["default-src 'none'", `img-src ${o.cspSource}`, `style-src 'nonce-${o.nonce}'`].join(
    "; ",
  );
  const afectados = e.afectados.map((a) => `<li>${escapeHtml(a)}</li>`).join("");
  const nota = e.notaExtra ? `<h2>Nota y excepciones</h2><p>${escapeHtml(e.notaExtra)}</p>` : "";
  const docs = e.docsUrl
    ? ` · <a href="${escapeHtml(e.docsUrl)}">Documentación de la regla</a>`
    : "";
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(e.titulo)}</title>
<style nonce="${o.nonce}">${STYLES}</style>
</head>
<body>
<header class="brand"><img src="${escapeHtml(o.logoUri)}" alt="Logotipo de Lupa A11y"><span>Lupa A11y</span></header>
<main>
<h1>${escapeHtml(e.titulo)}</h1>
<p><span class="badge">WCAG ${escapeHtml(e.wcag.criterio)} · ${escapeHtml(nivelTexto(e))}</span></p>
<h2>A quién afecta</h2>
<ul>${afectados}</ul>
<h2>Por qué importa</h2>
<p>${escapeHtml(e.porQueImporta)}</p>
<section class="ejemplo mal" aria-label="Ejemplo incorrecto">
<h2>Mal</h2>
<pre><code>${highlightJsx(e.malEjemplo)}</code></pre>
</section>
<section class="ejemplo bien" aria-label="Ejemplo correcto">
<h2>Bien</h2>
<pre><code>${highlightJsx(e.bienEjemplo)}</code></pre>
</section>
${nota}
<h2>Referencias</h2>
<p><a href="${escapeHtml(e.wcag.url)}">Criterio ${escapeHtml(e.wcag.criterio)} en W3C</a>${docs}</p>
</main>
</body>
</html>`;
}
