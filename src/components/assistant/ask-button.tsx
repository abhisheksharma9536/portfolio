"use client";

import type { ReactNode } from "react";
import { openAssistant } from "@/lib/events";
import { Sparkles } from "@/components/ui/icons";
import { cn } from "@/components/ui/primitives";

/** Opens the "Ask Abhishek" assistant with a question pre-filled and sent. */
export function AskButton({
  question,
  children,
  className,
}: {
  question: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openAssistant(question)}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition-colors hover:border-accent/60",
        className,
      )}
    >
      <Sparkles size={15} className="transition-transform group-hover:rotate-12" />
      {children}
    </button>
  );
}
