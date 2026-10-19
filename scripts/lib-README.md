# lupa-a11y-core

Núcleo de [Lupa A11y](https://github.com/AnderCMD/Lupa-a11y) sin dependencias de VS Code: el linter de accesibilidad para JSX/TSX con explicaciones en español, listo para usar en tus propias herramientas.

- **Traducciones** de 18 reglas de `eslint-plugin-jsx-a11y` (título, por qué importa, a quién afecta, ejemplo mal/bien, criterio WCAG 2.2).
- **Motor**: ejecuta `jsx-a11y` en memoria con el preset de Lupa A11y y mapea los mensajes a español.
- **Quick fixes seguros** como ediciones de texto por offsets (nunca inventan contenido descriptivo).

```bash
npm install lupa-a11y-core eslint
```

Requiere Node 20+ y `eslint` ^9 como dependencia de pares.

```ts
import { runEslint, mapMessages, getExplanation, getFixes, applyEdits } from "lupa-a11y-core";

const code = `export const Foto = () => <img src="/grafica.png" />;`;

// Posiciones base 0, mensajes en español.
const [d] = mapMessages(runEslint(code, "Foto.tsx", "typescriptreact"));
console.log(d.message); // "Esta imagen necesita un atributo alt que describa su contenido."

const info = getExplanation(d.ruleId); // título, porQueImporta, malEjemplo, bienEjemplo, wcag...

// Quick fix: pasa el offset donde empieza el diagnóstico (aquí, el inicio de <img).
const fix = getFixes(d.ruleId, code, code.indexOf("<img"))[0];
if (fix) console.log(applyEdits(code, fix.edits)); // ...<img src="/grafica.png" alt="" />
```

`lintDocument({ text, filePath, cwd, useProjectConfig })` además puede usar el `eslint.config.*` del proyecto (ejecuta código del proyecto: úsalo solo en entornos de confianza).

## Límites

El análisis estático no detecta todo ni sustituye probar con un lector de pantalla. Las reglas sin traducción devuelven el mensaje original con el sufijo " (sin traducir)".

Licencia MIT. Hecho sobre [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) y las [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
