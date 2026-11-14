import type { BuildOptions } from "esbuild";

export const sharedBundleOptions: Pick<BuildOptions, "alias" | "plugins" | "absWorkingDir">;
