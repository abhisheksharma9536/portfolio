"use client";

import { useId, useMemo, useState } from "react";
import {
  architectureEdges,
  architectureNodes,
  type ArchNode,
} from "@/content/goodiebag";
import { cn } from "@/components/ui/primitives";

const W = 1000;
const H = 620;

const nodeById = new Map(architectureNodes.map((n) => [n.id, n]));

const kindBackground: Record<ArchNode["kind"], string> = {
  core: "bg-surface",
  service: "bg-surface",
  data: "bg-subtle",
  external: "bg-bg border-dashed",
};

const kindBorder: Record<ArchNode["kind"], string> = {
  core: "border-line-strong",
  service: "border-accent/35",
  data: "border-line-strong",
  external: "border-line-strong",
};

/** Kind styling, with the accent border replacing the kind border when active. */
function nodeClass(kind: ArchNode["kind"], active: boolean) {
  return cn(kindBackground[kind], active ? "border-accent" : kindBorder[kind]);
}

const kindLabel: Record<ArchNode["kind"], string> = {
  core: "Core platform",
  service: "Service",
  data: "Data & cloud",
  external: "External integration",
};

function edgePath(fromId: string, toId: string) {
  const a = nodeById.get(fromId)!;
  const b = nodeById.get(toId)!;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Mostly-horizontal links curve with horizontal tangents; vertical ones with vertical tangents.
  if (Math.abs(dx) > Math.abs(dy)) {
    return `M ${a.x} ${a.y} C ${a.x + dx / 2} ${a.y}, ${b.x - dx / 2} ${b.y}, ${b.x} ${b.y}`;
  }
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy / 2}, ${b.x} ${b.y - dy / 2}, ${b.x} ${b.y}`;
}

function neighbours(id: string) {
  const set = new Set<string>([id]);
  for (const e of architectureEdges) {
    if (e.from === id) set.add(e.to);
    if (e.to === id) set.add(e.from);
  }
  return set;
}

const groups = ["Clients", "Platform", "Data & cloud", "Integrations"] as const;

/**
 * Interactive GoodieBag architecture. Every node is a real button: hover,
 * focus or tap to see what the component does and what it connects to.
 */
export function ArchitectureDiagram() {
  const [activeId, setActiveId] = useState("backend");
  const panelId = useId();
  const active = nodeById.get(activeId)!;
  const related = useMemo(() => neighbours(activeId), [activeId]);
  const connections = [...related]
    .filter((id) => id !== activeId)
    .map((id) => nodeById.get(id)!.label);

  return (
    <div className="grid gap-4">
      {/* Spatial diagram (lg and up) */}
      <div className="relative hidden lg:block">
        <div
          className="relative w-full [container-type:inline-size]"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {architectureEdges.map((edge) => {
              const on = edge.from === activeId || edge.to === activeId;
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edgePath(edge.from, edge.to)}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className={cn(
                    "transition-[stroke,opacity] duration-300",
                    on
                      ? "stroke-[var(--accent)] opacity-100 [stroke-dasharray:4_6] motion-safe:animate-[dash_0.9s_linear_infinite]"
                      : "stroke-[var(--line-strong)] opacity-80",
                  )}
                  strokeWidth={on ? 1.6 : 1}
                />
              );
            })}
          </svg>

          {architectureNodes.map((node) => {
            const isActive = node.id === activeId;
            const isRelated = related.has(node.id);
            return (
              <button
                key={node.id}
                type="button"
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
                aria-pressed={isActive}
                aria-controls={panelId}
                className={cn(
                  "absolute flex w-[19.5%] -translate-x-1/2 -translate-y-1/2 flex-col items-start rounded-xl border px-[1.1cqw] py-[0.9cqw] text-left transition-[border-color,box-shadow,opacity,transform] duration-300",
                  !isActive && "shadow-sm",
                  nodeClass(node.kind, isActive),
                  isActive && "z-10 shadow-[0_0_0_4px_var(--accent-soft),var(--shadow-md)]",
                  !isRelated && "opacity-55 hover:opacity-100",
                )}
                style={{ left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%` }}
              >
                <span className="max-w-full truncate text-[clamp(0.72rem,1.35cqw,0.9rem)] font-medium leading-tight tracking-tight">
                  {node.label}
                </span>
                <span className="mt-0.5 max-w-full truncate font-mono text-[clamp(0.55rem,0.95cqw,0.66rem)] leading-tight text-faint">
                  {node.sub}
                </span>
              </button>
            );
          })}

          <p className="pointer-events-none absolute left-[4%] top-[88%] font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint">
            Commerce integrations
          </p>
          <p className="pointer-events-none absolute right-[3.5%] top-[4%] font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint">
            Engagement &amp; AI
          </p>
        </div>
      </div>

      {/* Grouped list (below lg) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
        {groups.map((group) => (
          <div key={group}>
            <p className="eyebrow mb-2">{group}</p>
            <ul className="grid gap-1.5">
              {architectureNodes
                .filter((n) => n.group === group)
                .map((node) => {
                  const isActive = node.id === activeId;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(node.id)}
                        aria-pressed={isActive}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                          nodeClass(node.kind, isActive),
                          isActive && "shadow-[0_0_0_3px_var(--accent-soft)]",
                        )}
                      >
                        <span className="text-[0.92rem] font-medium tracking-tight">{node.label}</span>
                        <span className="text-right font-mono text-[0.66rem] text-faint">{node.sub}</span>
                      </button>
                      {isActive ? (
                        <p className="px-1 pb-1 pt-2.5 text-sm leading-relaxed text-muted">{node.description}</p>
                      ) : null}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div
        id={panelId}
        aria-live="polite"
        className="hidden grid-cols-1 gap-3 rounded-2xl lg:grid border border-line bg-bg/70 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:p-6"
      >
        <div>
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">{active.label}</span>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-faint">
              {kindLabel[active.kind]}
            </span>
          </p>
          <p className="mt-2 max-w-2xl text-[0.97rem] leading-relaxed text-muted">
            {active.description}
          </p>
        </div>
        {connections.length > 0 ? (
          <div className="sm:max-w-[16rem] sm:text-right">
            <p className="eyebrow mb-2">Connects to</p>
            <p className="text-sm text-fg/85">{connections.join(" · ")}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
