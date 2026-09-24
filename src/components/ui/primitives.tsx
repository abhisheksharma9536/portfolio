import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost";

const buttonBase =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const buttonVariants: Record<Variant, string> = {
  primary:
    "h-11 px-5 bg-fg text-bg shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset,0_8px_20px_-8px_rgb(0_0_0/0.35)] hover:bg-accent hover:text-accent-fg",
  secondary:
    "h-11 px-5 border border-line-strong bg-surface/70 text-fg backdrop-blur hover:border-fg/30 hover:bg-surface",
  ghost: "h-11 px-3 text-muted hover:text-fg",
};

export function buttonClass(variant: Variant = "primary", extra?: string) {
  return cn(buttonBase, buttonVariants[variant], extra);
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

type ExternalLinkProps = ComponentProps<"a">;

/** Anchor that opens in a new tab with safe rel attributes. */
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface/60 px-2.5 py-1 font-mono text-[0.7rem] leading-none tracking-tight text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

type SectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
};

/** Editorial section frame: "01 — About" eyebrow, large headline, optional intro. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
  aside,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("relative py-24 sm:py-32", className)}
    >
      <div className="container-page">
        <header className="reveal mb-12 grid grid-cols-1 gap-6 sm:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="text-accent">{index}</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>{eyebrow}</span>
            </p>
            <h2 id={headingId} className="headline max-w-4xl">
              {title}
            </h2>
          </div>
          {aside ? <div className="lg:col-span-4">{aside}</div> : null}
          {intro ? (
            <div className="prose-muted max-w-2xl text-base sm:text-lg lg:col-span-8">
              {intro}
            </div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
