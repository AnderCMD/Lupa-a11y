/**
 * Mide el tiempo de análisis de un archivo de ~500 líneas por framework con el preset.
 *
 *   npm run bench
 */
import { performance } from "node:perf_hooks";
import { runEslint } from "../src/linter/runEslint";

const jsxBlock = `
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

const markupBlock = (click: string) => `
  <section>
    <h2>Tarjeta {N}</h2>
    <img src="/foto-{N}.png">
    <a href="#" ${click}>Ver más</a>
    <div ${click}>Abrir</div>
    <label>Nombre</label>
    <input type="text" name="nombre-{N}" autofocus>
    <button type="button" tabindex="2">Siguiente</button>
    <video src="/demo-{N}.mp4" controls></video>
    <iframe src="https://example.com/{N}"></iframe>
  </section>
`;

function repeat(block: string, wrap: (body: string) => string = (b) => b): string {
  let body = "";
  for (let n = 0; wrap(body).split("\n").length < 500; n++)
    body += block.replaceAll("{N}", String(n));
  return wrap(body);
}

const CASES: [string, string, string][] = [
  ["JSX/TSX", "Archivo.tsx", repeat(jsxBlock)],
  [
    "Vue",
    "Archivo.vue",
    repeat(markupBlock(`@click="abrir"`), (b) => `<template>\n  <div>${b}</div>\n</template>\n`),
  ],
  ["Svelte", "Archivo.svelte", repeat(markupBlock(`on:click={() => abrir(1 > 0)}`))],
  ["HTML/Angular", "archivo.component.html", repeat(markupBlock(`(click)="abrir()"`))],
];

for (const [name, file, code] of CASES) {
  const t0 = performance.now();
  const first = runEslint(code, file);
  const cold = performance.now() - t0;
  const times: number[] = [];
  for (let i = 0; i < 30; i++) {
    const t = performance.now();
    runEslint(code, file);
    times.push(performance.now() - t);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)]!;
  const p95 = times[Math.floor(times.length * 0.95)]!;
  console.log(
    `${name.padEnd(13)} ${code.split("\n").length} líneas, ${(code.length / 1024).toFixed(1)} KB, ${first.length} diagnósticos · en frío ${cold.toFixed(0)} ms · mediana ${median.toFixed(0)} ms · p95 ${p95.toFixed(0)} ms (n=${times.length})`,
  );
}
