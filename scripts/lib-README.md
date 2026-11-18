# lupa-a11y-core

Núcleo de [Lupa A11y](https://github.com/AnderCMD/Lupa-a11y) sin dependencias de VS Code: el linter de accesibilidad con explicaciones en español para React/JSX, Vue, Svelte, Astro, plantillas de Angular y HTML, listo para usar en tus propias herramientas o en CI.

- **Explicaciones** de 43 reglas (título, por qué importa, a quién afecta, ejemplo mal/bien, criterio WCAG 2.2), más 30 reglas de Vue y HTML que reutilizan las equivalentes de JSX.
- **Motor**: ejecuta `jsx-a11y`, `vuejs-accessibility` o `@html-eslint` en memoria según el tipo de archivo y mapea los mensajes a español.
- **Quick fixes seguros** como ediciones de texto por offsets (nunca inventan contenido descriptivo).
- **CLI** `lupa-a11y` para CI y hooks de git.

## CLI

```bash
npx lupa-a11y src/ --max-warnings 0
npx lupa-a11y src/ --format json > a11y.json
```

Opciones: `--format text|json`, `--max-warnings <n>`, `--ignore-rule <id>` (repetible), `--project-config` y `--max-file-size <kb>`. Código de salida 1 si hay más problemas que `--max-warnings`, 2 si hay un error de uso. Omite `node_modules`, `dist`, `build`, `.next`, `.nuxt`, `.svelte-kit`, `.astro` y similares.

## API

```bash
npm install lupa-a11y-core eslint
```

Requiere Node 20+ y `eslint` ^9 como dependencia de pares.

```ts
import {
  runEslint,
  mapMessages,
  getExplanation,
  getFixes,
  applyEdits,
  flavorFor,
} from "lupa-a11y-core";

const code = `export const Foto = () => <img src="/grafica.png" />;`;

// Posiciones base 0, mensajes en español.
const [d] = mapMessages(runEslint(code, "Foto.tsx", "typescriptreact"));
console.log(d.message); // "Esta imagen necesita un atributo alt que describa su contenido."

const info = getExplanation(d.ruleId); // título, porQueImporta, malEjemplo, bienEjemplo, wcag...

// Quick fix: pasa el offset donde empieza el diagnóstico (aquí, el inicio de <img).
const fix = getFixes(d.ruleId, code, code.indexOf("<img"))[0];
if (fix) console.log(applyEdits(code, fix.edits)); // ...<img src="/grafica.png" alt="" />
```

Para Vue, Svelte, Astro o HTML basta con el nombre del archivo: `runEslint(code, "Tarjeta.vue")`. Para los quick fixes, pasa la familia como cuarto argumento: `getFixes(id, code, offset, flavorFor("Tarjeta.vue"))`.

`lintDocument({ text, filePath, cwd, useProjectConfig })` además puede usar el `eslint.config.*` del proyecto (ejecuta código del proyecto: úsalo solo en entornos de confianza).

## Límites

El análisis estático no detecta todo ni sustituye probar con un lector de pantalla. Las reglas sin traducción devuelven el mensaje original con el sufijo " (sin traducir)".

Licencia Apache 2.0. Hecho sobre [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y), [`eslint-plugin-vuejs-accessibility`](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility), [`@html-eslint`](https://html-eslint.org/) y las [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
