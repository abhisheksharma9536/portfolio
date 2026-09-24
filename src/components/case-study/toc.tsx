"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/primitives";

export type TocItem = { id: string; label: string; children?: TocItem[] };

/** Sticky case-study table of contents with scroll-spy. */
export function CaseStudyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const ids = items.flatMap((item) => [item.id, ...(item.children?.map((c) => c.id) ?? [])]);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections">
      <p className="eyebrow mb-4">On this page</p>
      <ol className="grid gap-0.5 border-l border-line">
        {items.map((item, i) => {
          const childActive = item.children?.some((c) => c.id === active);
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors",
                  active === item.id || childActive
                    ? "border-accent text-fg"
                    : "border-transparent text-muted hover:text-fg",
                )}
              >
                <span className="font-mono text-[0.7rem] text-faint">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
              {item.children && (childActive || active === item.id) ? (
                <ol className="mb-1 grid gap-0.5 pl-11">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        aria-current={active === child.id ? "location" : undefined}
                        className={cn(
                          "block py-1 text-[0.8rem] transition-colors",
                          active === child.id ? "text-accent" : "text-faint hover:text-fg",
                        )}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
