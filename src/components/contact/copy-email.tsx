"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@/components/ui/icons";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="inline-flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
      aria-label={copied ? "Email address copied" : "Copy email address"}
      title={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
