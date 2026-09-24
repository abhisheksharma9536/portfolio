"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { skillCategories } from "@/content/skills";
import { cn } from "@/components/ui/primitives";

/**
 * WAI-ARIA tabs (automatic activation, roving tabindex). Keeps the skills
 * section compact: one category's depth at a time instead of a keyword wall.
 */
export function SkillsTabs() {
  const [index, setIndex] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = skillCategories[index];

  const focusTab = (next: number) => {
    const count = skillCategories.length;
    const target = (next + count) % count;
    setIndex(target);
    tabRefs.current[target]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(index + 1),
      ArrowDown: () => focusTab(index + 1),
      ArrowLeft: () => focusTab(index - 1),
      ArrowUp: () => focusTab(index - 1),
      Home: () => focusTab(0),
      End: () => focusTab(skillCategories.length - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
      <div
        role="tablist"
        aria-label="Skill categories"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {skillCategories.map((category, i) => {
          const selected = i === index;
          return (
            <button
              key={category.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${category.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(i)}
              onKeyDown={onKeyDown}
              className={cn(
                "flex shrink-0 items-center justify-between gap-6 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-colors lg:rounded-xl lg:px-5 lg:py-3.5 lg:text-[0.98rem]",
                selected
                  ? "border-fg bg-fg text-bg"
                  : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {category.name}
              <span
                className={cn(
                  "hidden font-mono text-xs lg:inline",
                  selected ? "text-bg/60" : "text-faint",
                )}
              >
                {String(category.skills.length).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        tabIndex={0}
        className="card relative overflow-hidden p-6 sm:p-8 lg:col-span-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]"
        />
        <p className="eyebrow">{active.name}</p>
        <ul key={active.id} className="mt-6 flex flex-wrap gap-2.5">
          {active.skills.map((skill, i) => (
            <li
              key={skill}
              className="animate-rise rounded-xl border border-line bg-bg px-3.5 py-2 text-[0.95rem] font-medium tracking-tight"
              style={{ "--delay": `${i * 30}ms` } as React.CSSProperties}
            >
              {skill}
            </li>
          ))}
        </ul>
        <div className="mt-8 border-t border-line pt-5">
          <p className="eyebrow mb-2">Where it shows up</p>
          <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted">{active.context}</p>
        </div>
      </div>
    </div>
  );
}
