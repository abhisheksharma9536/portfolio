"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { assistantCopy, suggestedQuestions } from "@/content/assistant";
import { CHAT_LIMITS } from "@/lib/ai/protocol";
import { AlertCircle, Close, Refresh, Send, Sparkles, Stop, Trash } from "@/components/ui/icons";
import { cn } from "@/components/ui/primitives";
import { Markdown } from "./markdown";
import { useChat } from "./use-chat";

type Props = {
  open: boolean;
  onClose: () => void;
  /** A question to send as soon as the panel is ready (from "Ask about…" buttons). */
  pendingQuestion: { id: number; text: string } | null;
  onPendingHandled: () => void;
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-faint motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 140}ms`, animationDuration: "1s" }}
        />
      ))}
    </span>
  );
}

function Avatar() {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-accent-fg"
    >
      <Sparkles size={14} />
    </span>
  );
}

export default function AssistantPanel({ open, onClose, pendingQuestion, onPendingHandled }: Props) {
  const titleId = useId();
  const inputId = useId();
  const { messages, error, pending, send, retry, stop, clear } = useChat();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streaming = messages.some((m) => m.streaming);

  // Send questions coming from "Ask about …" buttons elsewhere on the page.
  useEffect(() => {
    if (!pendingQuestion || pending) return;
    send(pendingQuestion.text);
    onPendingHandled();
  }, [pendingQuestion, pending, send, onPendingHandled]);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Keep the newest content in view while streaming.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, error]);

  // Auto-size the textarea (1–5 rows).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 136)}px`;
  }, [draft]);

  const submit = () => {
    if (!draft.trim() || pending) return;
    send(draft);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const followUps = suggestedQuestions.filter((q) => !asked.has(q)).slice(0, 3);
  const lastIsSettledAnswer =
    messages.length > 0 && messages[messages.length - 1].role === "assistant" && !pending;
  const closeOnMobileNavigate = () => {
    if (window.matchMedia("(max-width: 639px)").matches) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      hidden={!open}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
      className={cn(
        "fixed z-[60] flex flex-col overflow-hidden border border-line bg-surface shadow-lifted",
        "inset-x-0 bottom-0 h-[88dvh] rounded-t-[1.6rem]",
        "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(40rem,calc(100dvh-3rem))] sm:w-[25rem] sm:rounded-[1.4rem]",
        open && "motion-safe:animate-[rise_0.35s_cubic-bezier(0.2,0.7,0.2,1)_both]",
      )}
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
        <Avatar />
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="flex items-center gap-2 text-[0.95rem] font-semibold tracking-tight">
            {assistantCopy.name}
            <span className="rounded-full border border-accent/30 bg-accent-soft px-1.5 py-px font-mono text-[0.6rem] font-medium uppercase tracking-wider text-accent">
              AI
            </span>
          </h2>
          <p className="text-xs leading-snug text-muted">{assistantCopy.subtitle}</p>
        </div>
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
            className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-fg"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <Trash size={16} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-fg"
          aria-label="Close assistant"
        >
          <Close size={17} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
        {messages.length === 0 ? (
          <div className="grid gap-5">
            <div className="flex gap-3">
              <Avatar />
              <p className="pt-0.5 text-[0.93rem] leading-relaxed text-muted">{assistantCopy.intro}</p>
            </div>
            <div>
              <p className="eyebrow mb-2.5">Try asking</p>
              <ul className="grid gap-1.5">
                {suggestedQuestions.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => send(question)}
                      className="w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-left text-[0.88rem] text-fg/90 transition-colors hover:border-accent/40 hover:text-fg"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div role="log" aria-live="polite" aria-busy={streaming} aria-label="Conversation" className="grid gap-5">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-fg px-3.5 py-2.5 text-[0.92rem] leading-relaxed text-bg">
                    <span className="sr-only">You: </span>
                    {message.content}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="flex gap-3">
                  <Avatar />
                  <div className="min-w-0 flex-1 pt-0.5 text-[0.92rem] leading-relaxed text-fg/90">
                    <span className="sr-only">Assistant: </span>
                    {message.content ? (
                      <Markdown source={message.content} onNavigate={closeOnMobileNavigate} />
                    ) : (
                      <TypingDots />
                    )}
                  </div>
                </div>
              ),
            )}

            {error ? (
              <div role="alert" className="flex gap-3 rounded-xl border border-danger/25 bg-danger/5 p-3.5 text-[0.88rem]">
                <AlertCircle size={17} className="mt-0.5 shrink-0 text-danger" />
                <div className="grid gap-2">
                  <p>{error.message}</p>
                  {error.retryable ? (
                    <button
                      type="button"
                      onClick={retry}
                      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-medium hover:border-fg/30"
                    >
                      <Refresh size={13} />
                      Retry
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {lastIsSettledAnswer && followUps.length > 0 ? (
              <div className="pl-10">
                <p className="eyebrow mb-2">Related</p>
                <ul className="flex flex-wrap gap-1.5">
                  {followUps.map((question) => (
                    <li key={question}>
                      <button
                        type="button"
                        onClick={() => send(question)}
                        className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-end gap-2 rounded-2xl border border-line-strong bg-bg p-1.5 pl-3.5 transition-[border-color,box-shadow] focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--accent-soft)]"
        >
          <label htmlFor={inputId} className="sr-only">
            Ask a question about Abhishek
          </label>
          <textarea
            id={inputId}
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={CHAT_LIMITS.userMessage}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about GoodieBag, AWS, AI work…"
            className="max-h-[8.5rem] flex-1 resize-none bg-transparent py-2 text-[0.92rem] leading-snug text-fg outline-none placeholder:text-faint"
          />
          {pending ? (
            <button
              type="button"
              onClick={stop}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-fg text-bg hover:bg-accent hover:text-accent-fg"
              aria-label="Stop generating"
            >
              <Stop size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-fg text-bg transition-colors hover:bg-accent hover:text-accent-fg disabled:bg-subtle disabled:text-faint"
              aria-label="Send question"
            >
              <Send size={17} />
            </button>
          )}
        </form>
        <p className="mt-2 flex justify-between gap-3 px-1 text-[0.68rem] text-faint">
          <span>{assistantCopy.disclaimer}</span>
          {draft.length > CHAT_LIMITS.userMessage * 0.8 ? (
            <span className="font-mono">
              {draft.length}/{CHAT_LIMITS.userMessage}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
