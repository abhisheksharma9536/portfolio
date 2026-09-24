import "server-only";

/**
 * Fixed-window rate limiting.
 *
 * With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set, counters live in
 * Redis and are shared across every serverless instance. Without them, an
 * in-memory map limits per instance — adequate for a portfolio, and the
 * limiter degrades to it if Redis is unreachable rather than failing requests.
 */

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

type Options = { limit: number; windowMs: number };

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, { limit, windowMs }: Options): RateLimitResult {
  const now = Date.now();
  if (memory.size > 10_000) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  }
  const entry = memory.get(key);
  const current =
    entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + windowMs };
  current.count += 1;
  memory.set(key, current);
  return {
    ok: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

async function redisLimit(
  url: string,
  token: string,
  key: string,
  { limit, windowMs }: Options,
): Promise<RateLimitResult> {
  const res = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["SET", key, "0", "PX", String(windowMs), "NX"],
      ["INCR", key],
      ["PTTL", key],
    ]),
    signal: AbortSignal.timeout(1500),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const [, incr, ttl] = (await res.json()) as Array<{ result?: number; error?: string }>;
  if (typeof incr?.result !== "number") throw new Error("Unexpected Upstash response");
  const count = incr.result;
  const ttlMs = typeof ttl?.result === "number" && ttl.result > 0 ? ttl.result : windowMs;
  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfter: Math.ceil(ttlMs / 1000),
  };
}

export async function rateLimit(key: string, options: Options): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      return await redisLimit(url, token, `rl:${key}`, options);
    } catch (error) {
      console.warn("[rate-limit] Redis unavailable, using in-memory limiter:", error);
    }
  }
  return memoryLimit(key, options);
}
