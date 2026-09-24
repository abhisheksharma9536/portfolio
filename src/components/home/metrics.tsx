import { metrics } from "@/content/metrics";
import { CountUp } from "./count-up";

const scopeStyles: Record<string, string> = {
  Career: "text-fg border-line-strong",
  GoodieBag: "text-accent border-accent/30 bg-accent-soft",
  "Code Analyzer": "text-muted border-line-strong",
};

export function Metrics() {
  return (
    <section aria-labelledby="impact-heading" className="relative py-12 sm:py-16">
      <div className="container-page">
        <div className="reveal mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Impact</p>
            <h2 id="impact-heading" className="text-2xl font-medium tracking-tight sm:text-3xl">
              Proof, not adjectives.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted">
            Every number is scoped to where it happened — most come from the
            GoodieBag marketplace.
          </p>
        </div>

        <ul className="reveal grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <li
              key={metric.label}
              className="group relative flex flex-col bg-bg p-6 transition-colors hover:bg-surface sm:p-8"
            >
              <span
                className={`mb-8 inline-flex w-fit items-center rounded-full border px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] ${scopeStyles[metric.scope]}`}
              >
                {metric.scope}
              </span>
              <p className="display text-[clamp(3.2rem,8vw,4.75rem)] leading-none">
                <CountUp
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  grouped={metric.grouped}
                />
              </p>
              <p className="mt-4 text-[1.02rem] font-medium tracking-tight">
                {metric.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {metric.context}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
