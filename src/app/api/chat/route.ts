import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { parseChatRequest, type ChatStreamEvent } from "@/lib/ai/protocol";
import { clientIp, isAllowedOrigin, jsonError, readJson } from "@/lib/server/http";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-5";
const EFFORTS = ["low", "medium", "high"] as const;
type Effort = (typeof EFFORTS)[number];
/** Grounded Q&A over a small knowledge base: low effort keeps answers fast and cheap. */
const EFFORT: Effort = EFFORTS.includes(process.env.ANTHROPIC_EFFORT as Effort)
  ? (process.env.ANTHROPIC_EFFORT as Effort)
  : "low";
/** Caps spend per answer on a public endpoint; covers thinking plus a concise reply. */
const MAX_TOKENS = 4096;
/** Models that support server-side refusal fallbacks with `fallbacks: "default"`. */
const SERVER_FALLBACK_MODELS = new Set(["claude-opus-5"]);

let anthropic: Anthropic | null = null;
function getClient() {
  anthropic ??= new Anthropic({ maxRetries: 2, timeout: 50_000 });
  return anthropic;
}

function describeError(error: unknown): { message: string; retryable: boolean } {
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    console.error("[chat] Anthropic credentials rejected:", error.message);
    return { message: "The assistant is temporarily unavailable.", retryable: false };
  }
  if (error instanceof Anthropic.RateLimitError) {
    return { message: "The assistant is busy right now. Please try again in a moment.", retryable: true };
  }
  if (error instanceof Anthropic.BadRequestError) {
    console.error("[chat] Bad request to Anthropic:", error.message);
    return { message: "The assistant couldn't process that request.", retryable: false };
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return { message: "Couldn't reach the AI service. Please try again.", retryable: true };
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`[chat] Anthropic API error ${error.status}:`, error.message);
    return { message: "The AI service had a problem. Please try again.", retryable: true };
  }
  console.error("[chat] Unexpected error:", error);
  return { message: "Something went wrong. Please try again.", retryable: true };
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return jsonError(403, "Forbidden.");

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(503, "The assistant isn't configured yet. Please use the contact form or email instead.", {
      code: "not_configured",
    });
  }

  const ip = clientIp(request);
  const limit = await rateLimit(`chat:${ip}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) {
    return jsonError(
      429,
      "You've asked a lot of questions in a short time. Please try again in a few minutes.",
      { retryAfter: limit.retryAfter },
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const parsed = parseChatRequest(await readJson(request, 64_000));
  if (!parsed.ok) return jsonError(400, parsed.error);

  const fallbackParams = SERVER_FALLBACK_MODELS.has(MODEL)
    ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
    : {};

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        const stream = getClient().beta.messages.stream(
          {
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages: parsed.messages,
            output_config: { effort: EFFORT },
            ...fallbackParams,
          },
          { signal: request.signal },
        );

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ type: "delta", text: event.delta.text });
          }
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send({
            type: "error",
            message: "I can't help with that one. Try asking about Abhishek's experience, projects or skills.",
            retryable: false,
            discardPartial: true,
          });
        } else {
          send({ type: "done", truncated: final.stop_reason === "max_tokens" });
        }
      } catch (error) {
        if (request.signal.aborted || error instanceof Anthropic.APIUserAbortError) {
          // Visitor closed the panel or pressed stop — nothing to report.
        } else {
          send({ type: "error", ...describeError(error) });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // Stream already closed by a client disconnect.
        }
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
