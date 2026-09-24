/**
 * Build-time deployment settings (inlined into client bundles by Next.js).
 *
 * - NEXT_PUBLIC_STATIC_EXPORT=true   static build for GitHub Pages (no API routes)
 * - NEXT_PUBLIC_BASE_PATH=/portfolio  site served from a sub-path
 * - NEXT_PUBLIC_ASSISTANT_PROVIDER    "local" (default, no AI API) or "claude"
 */

export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/** Prefixes a site-relative path for plain <a>/<link> tags (next/link adds the base path itself). */
export function withBasePath(path: string) {
  return `${basePath}${path}`;
}

/**
 * The assistant answers from the local knowledge engine unless the Claude
 * API is explicitly enabled on a server deployment.
 */
export const assistantProvider: "local" | "claude" =
  !isStaticExport && process.env.NEXT_PUBLIC_ASSISTANT_PROVIDER === "claude" ? "claude" : "local";
