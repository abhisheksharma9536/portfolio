"use client";

import { useId, useState } from "react";
import { webhookFlow } from "@/content/goodiebag";
import { cn } from "@/components/ui/primitives";

/**
 * POS → Webhook → Backend → Database → Storefront. A change event travels the
 * track continuously; each stage is a button that explains its role.
 */
export function WebhookFlow() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const step = webhookFlow[active];

  return (
    <div className="card overflow-hidden rounded-[1.4rem]">
      <div className="relative px-5 pb-6 pt-8 sm:px-8">
        {/* Track + travelling change event */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] top-[3.35rem] hidden h-px bg-line-strong md:block">
          <span className="webhook-packet absolute -top-[5px] left-0 flex items-center gap-2">
            <span className="size-[11px] rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft),0_0_16px_var(--accent)]" />
          </span>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-10 left-[2.55rem] top-12 w-px bg-line-strong md:hidden sm:left-[3.3rem]" />

        <ol className="relative grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-4">
          {webhookFlow.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.id} className="md:text-center">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-controls={panelId}
                  className="group flex w-full items-center gap-4 rounded-2xl p-1 text-left md:flex-col md:gap-3 md:text-center"
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-11 shrink-0 place-items-center rounded-full border font-mono text-xs transition-[border-color,background-color,color,box-shadow] duration-300",
                      isActive
                        ? "border-accent bg-accent text-accent-fg shadow-[0_0_0_6px_var(--accent-soft)]"
                        : "border-line-strong bg-surface text-muted group-hover:border-accent/50 group-hover:text-fg",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className={cn("block font-semibold tracking-tight", isActive ? "text-fg" : "text-fg/80")}>
                      {s.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.68rem] text-faint">{s.sub}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div id={panelId} aria-live="polite" className="border-t border-line bg-subtle/50 px-5 py-5 sm:px-8">
        <p className="eyebrow">
          Step {active + 1} of {webhookFlow.length} · {step.label}
        </p>
        <p className="mt-2 max-w-3xl leading-relaxed text-fg/90">{step.role}</p>
      </div>
    </div>
  );
}
