import "server-only";

/** Best-effort client IP. On Vercel, x-forwarded-for is set by the platform edge. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Rejects cross-site browser requests. Browsers always send Origin on POST;
 * a mismatch means another site is trying to use these endpoints.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function jsonError(
  status: number,
  error: string,
  extra?: Record<string, unknown>,
  headers?: HeadersInit,
) {
  return Response.json({ ok: false, error, ...extra }, { status, headers });
}

/** Reads a JSON body with a hard size cap (bytes), returning null when invalid or too large. */
export async function readJson(request: Request, maxBytes: number): Promise<unknown | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) return null;
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
