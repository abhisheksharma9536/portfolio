/**
 * Wire protocol between the chat panel and /api/chat. The response is
 * newline-delimited JSON so text can stream and errors can arrive mid-stream
 * without ambiguity.
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done"; truncated?: boolean }
  | {
      type: "error";
      message: string;
      retryable: boolean;
      /** The partial answer should not be shown as complete. */
      discardPartial?: boolean;
    };

export const CHAT_LIMITS = {
  /** Max characters in one visitor question. */
  userMessage: 1000,
  /** Max characters of an earlier assistant reply echoed back as history. */
  assistantMessage: 6000,
  /** Messages sent per request (older turns are dropped client-side). */
  historyMessages: 12,
} as const;

export type ParsedChatRequest =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

/**
 * Validates an incoming chat request body. Enforces alternating roles,
 * starting and ending with a user turn, and per-message size limits.
 */
export function parseChatRequest(body: unknown): ParsedChatRequest {
  if (!body || typeof body !== "object" || !("messages" in body)) {
    return { ok: false, error: "Missing messages." };
  }
  const raw = (body as { messages: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, error: "Messages must be a non-empty array." };
  }
  if (raw.length > CHAT_LIMITS.historyMessages + 1) {
    return { ok: false, error: "Conversation too long." };
  }

  const messages: ChatMessage[] = [];
  for (const [i, item] of raw.entries()) {
    if (!item || typeof item !== "object") return { ok: false, error: "Invalid message." };
    const { role, content } = item as { role?: unknown; content?: unknown };
    const expected: ChatRole = i % 2 === 0 ? "user" : "assistant";
    if (role !== expected) return { ok: false, error: "Messages must alternate, starting with the user." };
    if (typeof content !== "string") return { ok: false, error: "Message content must be text." };
    const text = content.trim();
    const max = role === "user" ? CHAT_LIMITS.userMessage : CHAT_LIMITS.assistantMessage;
    if (!text) return { ok: false, error: "Messages cannot be empty." };
    if (text.length > max) {
      return {
        ok: false,
        error: role === "user" ? `Please keep questions under ${max} characters.` : "Message too long.",
      };
    }
    messages.push({ role: expected, content: text });
  }

  if (messages[messages.length - 1].role !== "user") {
    return { ok: false, error: "The last message must be from the user." };
  }
  return { ok: true, messages };
}
