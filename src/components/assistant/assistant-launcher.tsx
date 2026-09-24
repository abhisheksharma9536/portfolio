"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ASSISTANT_OPEN_EVENT, type AssistantOpenDetail } from "@/lib/events";
import { assistantCopy } from "@/content/assistant";
import { Sparkles } from "@/components/ui/icons";
import { cn } from "@/components/ui/primitives";

const loadPanel = () => import("./assistant-panel");
const AssistantPanel = dynamic(loadPanel, { ssr: false, loading: () => null });

/**
 * Floating "Ask Abhishek" launcher. The chat panel's code is only fetched on
 * first intent (hover, focus or click), keeping it out of the initial bundle.
 */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<{ id: number; text: string } | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [compact, setCompact] = useState(false);

  // Past the hero the launcher collapses to its icon so it never covers
  // content; hover or keyboard focus expands it again.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const { question } = (event as CustomEvent<AssistantOpenDetail>).detail ?? {};
      if (question) setPendingQuestion({ id: Date.now(), text: question });
      show();
    };
    window.addEventListener(ASSISTANT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASSISTANT_OPEN_EVENT, onOpen);
  }, [show]);

  const clearPending = useCallback(() => setPendingQuestion(null), []);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={show}
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        aria-haspopup="dialog"
        aria-label={compact ? `${assistantCopy.name} — portfolio assistant` : undefined}
        aria-expanded={open}
        className={cn(
          "group fixed bottom-4 right-4 z-40 flex items-center rounded-full border border-line bg-surface/90 p-1.5 shadow-lifted backdrop-blur-xl transition-[transform,opacity,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:bottom-6 sm:right-6",
          open && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <span className="relative grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-accent-fg">
          <Sparkles size={15} className="transition-transform duration-300 group-hover:rotate-12" />
        </span>
        <span
          className={cn(
            "grid overflow-hidden text-left leading-tight transition-[grid-template-columns,opacity,padding] duration-300 ease-out",
            compact
              ? "grid-cols-[0fr] opacity-0 group-hover:grid-cols-[1fr] group-hover:pl-2.5 group-hover:pr-2.5 group-hover:opacity-100 group-focus-visible:grid-cols-[1fr] group-focus-visible:pl-2.5 group-focus-visible:pr-2.5 group-focus-visible:opacity-100"
              : "grid-cols-[1fr] pl-2.5 pr-2.5 opacity-100",
          )}
        >
          <span className="min-w-0 whitespace-nowrap">
            <span className="block text-[0.86rem] font-semibold tracking-tight">{assistantCopy.name}</span>
            <span className="hidden text-[0.68rem] text-muted sm:block">Answers from my portfolio</span>
          </span>
        </span>
      </button>

      {open ? (
        <div aria-hidden="true" onClick={close} className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-[2px] sm:hidden" />
      ) : null}

      {mounted ? (
        <AssistantPanel
          open={open}
          onClose={close}
          pendingQuestion={pendingQuestion}
          onPendingHandled={clearPending}
        />
      ) : null}
    </>
  );
}
