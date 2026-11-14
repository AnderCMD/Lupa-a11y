import { runCli } from "./cli";

runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  out: (line) => console.log(line),
  err: (line) => console.error(line),
}).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(`lupa-a11y: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
  },
);
