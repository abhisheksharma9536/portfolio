import type { ReactNode } from "react";
import { cn } from "@/components/ui/primitives";

export function CsSection({
  id,
  index,
  title,
  lead,
  children,
}: {
  id: string;
  index: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-line py-16 first:border-t-0 first:pt-0 sm:py-20">
      <p className="eyebrow mb-4 flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      </p>
      <h2 id={`${id}-title`} className="text-[clamp(1.75rem,1.2rem+2vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {lead ? <div className="prose-muted mt-5 max-w-3xl text-[1.05rem] sm:text-lg">{lead}</div> : null}
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}

export function SubSection({
  id,
  kicker,
  title,
  children,
  aside,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 py-10 first:pt-0 sm:py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-[0.72rem] text-accent">{kicker}</p>
          <h3 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            {title}
          </h3>
        </div>
        {aside}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Bullets({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-[0.72rem] h-px w-3 shrink-0 bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-medium tracking-tight",
        active ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-bg text-fg/90",
      )}
    >
      {children}
    </span>
  );
}

export function Arrow({ vertical }: { vertical?: boolean }) {
  return (
    <span aria-hidden="true" className={cn("text-faint", vertical ? "block py-1 text-center" : "px-1.5")}>
      {vertical ? "↓" : "→"}
    </span>
  );
}
