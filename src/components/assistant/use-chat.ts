"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT_LIMITS, type ChatMessage, type ChatStreamEvent } from "@/lib/ai/protocol";
import { assistantProvider } from "@/lib/deployment";

export type UiMessage = {
  id: string;
  role: ChatMessage["role"];
  content: string;
  streaming?: boolean;
};

export type ChatError = { message: string; retryable: boolean };

const STORAGE_KEY = "ask-abhishek:v1";

class ChatRequestError extends Error {
  constructor(
    message: string,
    public retryable: boolean,
    public discardPartial = false,
  ) {
    super(message);
  }
}

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadSession(): UiMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (m): m is UiMessage =>
          !!m &&
          typeof m.id === "string" &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string",
      )
      .map(({ id, role, content }) => ({ id, role, content }));
  } catch {
    return [];
  }
}

function saveSession(messages: UiMessage[]) {
  try {
    const settled = messages.filter((m) => !m.streaming && m.content.trim());
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settled.slice(-40)));
  } catch {
    // Storage unavailable — the conversation just won't survive a reload.
  }
}

/**
 * Builds a valid request history: strictly alternating, starting and ending
 * with the visitor. Unanswered questions (after an error or a stop) stay
 * visible in the UI but are superseded by the next one in the payload.
 */
export function toPayload(history: UiMessage[]): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const m of history) {
    const content =
      m.role === "assistant" ? m.content.trim().slice(0, CHAT_LIMITS.assistantMessage) : m.content.trim();
    if (!content) continue;
    const last = out[out.length - 1];
    if (!last) {
      if (m.role === "user") out.push({ role: "user", content });
    } else if (last.role === m.role) {
      if (m.role === "user") out[out.length - 1] = { role: "user", content };
    } else {
      out.push({ role: m.role, content });
    }
  }
  while (out.length && out[out.length - 1].role !== "user") out.pop();
  // Alternating and ending with "user" means an odd length; an odd-sized tail keeps the "user" start.
  const maxOdd = CHAT_LIMITS.historyMessages - (CHAT_LIMITS.historyMessages % 2 === 0 ? 1 : 0);
  return out.slice(-maxOdd);
}

async function readError(response: Response): Promise<ChatRequestError> {
  const data = (await response.json().catch(() => null)) as { error?: string; code?: string } | null;
  const retryable = response.status === 429 || (response.status >= 500 && data?.code !== "not_configured");
  return new ChatRequestError(data?.error ?? "The assistant couldn't answer right now.", retryable);
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

/**
 * Answers from the local knowledge engine (no network, no AI service) and
 * reveals the reply progressively so it reads like the streamed variant.
 */
async function answerLocally(
  history: UiMessage[],
  onText: (text: string) => void,
  signal: AbortSignal,
): Promise<boolean> {
  const { answerQuestion } = await import("@/lib/assistant/engine");
  const payload = toPayload(history);
  const question = payload[payload.length - 1]?.content ?? "";
  const answer = answerQuestion(question, payload.slice(0, -1));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onText(answer);
    return true;
  }
  await sleep(380, signal);
  const words = answer.match(/\S+\s*/g) ?? [answer];
  let shown = "";
  for (let i = 0; i < words.length; i += 3) {
    shown += words.slice(i, i + 3).join("");
    onText(shown);
    await sleep(22, signal);
  }
  return true;
}

/** Streams an answer from /api/chat (Claude API, server deployments only). */
async function streamFromApi(
  history: UiMessage[],
  onText: (text: string) => void,
  signal: AbortSignal,
): Promise<boolean> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: toPayload(history) }),
    signal,
  });
  if (!response.ok || !response.body) throw await readError(response);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return false;
    buffer += value;
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      const event = JSON.parse(line) as ChatStreamEvent;
      if (event.type === "delta") {
        text += event.text;
        onText(text);
      } else if (event.type === "error") {
        throw new ChatRequestError(event.message, event.retryable, event.discardPartial);
      } else if (event.type === "done") {
        if (event.truncated) onText(`${text}\n\n…`);
        return true;
      }
    }
  }
}

export function useChat() {
  const [messages, setMessages] = useState<UiMessage[]>(loadSession);
  const [error, setError] = useState<ChatError | null>(null);
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveSession(messages);
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (history: UiMessage[]) => {
    const assistantId = uid();
    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    setPending(true);
    setMessages([...history, { id: assistantId, role: "assistant", content: "", streaming: true }]);

    const patchAssistant = (patch: Partial<UiMessage> | null) =>
      setMessages((prev) =>
        patch === null
          ? prev.filter((m) => m.id !== assistantId)
          : prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)),
      );

    let text = "";
    try {
      const onText = (next: string) => {
        text = next;
        patchAssistant({ content: text });
      };
      const finished =
        assistantProvider === "local"
          ? await answerLocally(history, onText, controller.signal)
          : await streamFromApi(history, onText, controller.signal);
      if (!finished) throw new ChatRequestError("The answer was interrupted. Please try again.", true, true);
      if (!text.trim()) throw new ChatRequestError("The assistant returned an empty answer.", true);
      patchAssistant({ content: text, streaming: false });
    } catch (err) {
      if (controller.signal.aborted) {
        // Stopped by the visitor: keep whatever arrived.
        patchAssistant(text.trim() ? { content: text, streaming: false } : null);
      } else {
        const failure =
          err instanceof ChatRequestError
            ? err
            : new ChatRequestError("Couldn't connect. Check your connection and try again.", true);
        const keepPartial = text.trim() && !failure.discardPartial;
        patchAssistant(keepPartial ? { content: text, streaming: false } : null);
        setError({ message: failure.message, retryable: failure.retryable && !keepPartial });
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setPending(false);
    }
  }, []);

  const send = useCallback(
    (question: string) => {
      const content = question.trim().slice(0, CHAT_LIMITS.userMessage);
      if (!content || pending) return;
      void run([...messages, { id: uid(), role: "user", content }]);
    },
    [messages, pending, run],
  );

  const retry = useCallback(() => {
    if (pending || messages[messages.length - 1]?.role !== "user") return;
    void run(messages);
  }, [messages, pending, run]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, error, pending, send, retry, stop, clear };
}
