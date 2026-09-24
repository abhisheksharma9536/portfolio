import {
  MIN_FILL_TIME_MS,
  normalizeContact,
  validateContact,
} from "@/lib/validation/contact";
import { clientIp, isAllowedOrigin, jsonError, readJson } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";
import { EmailNotConfiguredError, sendContactEmail } from "@/lib/server/email";

export const runtime = "nodejs";
export const maxDuration = 15;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — invisible to people, tempting to bots. */
  website?: unknown;
  /** Epoch ms when the form was rendered. */
  startedAt?: unknown;
};

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return jsonError(403, "Forbidden.");

  const body = (await readJson(request, 16_000)) as ContactBody | null;
  if (!body || typeof body !== "object") {
    return jsonError(400, "Invalid request.");
  }

  // Spam signals: filled honeypot or an implausibly fast submission. Respond
  // as if it worked so bots get no signal to adapt to.
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  const tooFast = Date.now() - startedAt < MIN_FILL_TIME_MS;
  const honeypot = typeof body.website === "string" && body.website.trim() !== "";
  if (honeypot || tooFast) {
    return Response.json({ ok: true });
  }

  const input = normalizeContact(body);
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return jsonError(422, "Please fix the highlighted fields.", { fields: errors });
  }

  const ip = clientIp(request);
  const limit = await rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.ok) {
    return jsonError(
      429,
      "You've sent several messages recently. Please try again later or email me directly.",
      undefined,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  try {
    await sendContactEmail(input);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      console.error("[contact] RESEND_API_KEY is not configured.");
      return jsonError(503, "The contact form isn't available right now. Please email me directly.", {
        code: "not_configured",
      });
    }
    console.error("[contact] Delivery failed:", error);
    return jsonError(502, "Your message couldn't be delivered. Please try again or email me directly.");
  }
}
