/**
 * Mide el tiempo de análisis de un archivo TSX de ~500 líneas con el preset.
 *
 *   npm run bench
 */
import { performance } from "node:perf_hooks";
import { runEslint } from "../src/linter/runEslint";

const block = `
export function Tarjeta{N}({ titulo, abrir }: { titulo: string; abrir: () => void }) {
  return (
    <section>
      <h2>{titulo}</h2>
      <img src="/foto-{N}.png" />
      <img src="/logo-{N}.png" alt="Imagen de un logo" />
      <a href="#" onClick={abrir}>Ver más</a>
      <div onClick={abrir}>Abrir</div>
      <label>Nombre</label>
      <input type="text" name="nombre-{N}" autoFocus />
      <button type="button" tabIndex={2}>Siguiente</button>
      <video src="/demo-{N}.mp4" controls />
      <iframe src="https://example.com/{N}" />
    </section>
  );
}
`;

let code = "";
for (let n = 0; code.split("\n").length < 500; n++) code += block.replaceAll("{N}", String(n));
const lines = code.split("\n").length;

const t0 = performance.now();
const first = runEslint(code, "Archivo.tsx");
const cold = performance.now() - t0;

const times: number[] = [];
for (let i = 0; i < 30; i++) {
  const t = performance.now();
  runEslint(code, "Archivo.tsx");
  times.push(performance.now() - t);
}
times.sort((a, b) => a - b);
const median = times[Math.floor(times.length / 2)]!;
const p95 = times[Math.floor(times.length * 0.95)]!;

console.log(
  `Archivo: ${lines} líneas, ${(code.length / 1024).toFixed(1)} KB, ${first.length} diagnósticos`,
);
console.log(`Primera ejecución (en frío): ${cold.toFixed(0)} ms`);
console.log(
  `Ejecuciones siguientes: mediana ${median.toFixed(0)} ms, p95 ${p95.toFixed(0)} ms (n=${times.length})`,
);
