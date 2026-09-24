import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const srcRoot = new URL("../../src/", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = new URL(specifier.slice(2), srcRoot).href;
    for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
      const candidate = base + suffix;
      if (existsSync(fileURLToPath(candidate)) && !candidate.endsWith("/")) {
        return nextResolve(candidate, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
