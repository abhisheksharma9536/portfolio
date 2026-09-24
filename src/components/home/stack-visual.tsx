import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

const layers = [
  { name: "Client", tech: ["Flutter", "React.js"], note: "iOS · Android · Web" },
  { name: "API", tech: ["REST", "JWT", "Webhooks"], note: "Validation · RBAC" },
  { name: "Services", tech: ["Node.js", "Express.js", "FastAPI"], note: "Microservices" },
  { name: "Data", tech: ["PostgreSQL", "MongoDB"], note: "Queries · indexing" },
  { name: "Cloud", tech: ["AWS Lambda", "S3", "Cognito", "Docker"], note: "Serverless · CI/CD" },
  { name: "AI & Integrations", tech: ["Claude API", "Square", "Clover", "Stripe"], note: "LLMs · POS · payments" },
];

function Plane() {
  return (
    <svg
      viewBox="0 0 72 40"
      className="stack-plane h-9 w-16 shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <polygon
        className="stack-plane-edge"
        points="4,20 36,36 68,20 68,23.5 36,39.5 4,23.5"
      />
      <polygon className="stack-plane-top" points="36,4 68,20 36,36 4,20" />
      <polygon
        className="stack-plane-inner"
        points="36,12 52,20 36,28 20,20"
      />
    </svg>
  );
}

/**
 * Hero engineering visual: an exploded view of the layers Abhishek builds
 * across. A signal travels down the stack and lights each layer in turn —
 * pure CSS, paused under prefers-reduced-motion.
 */
export function StackVisual() {
  return (
    <figure
      aria-label="The layers of a production system Abhishek works across, from client apps to AI and integrations"
      className="card relative overflow-hidden rounded-[1.4rem] p-2 shadow-lifted"
    >
      <div className="rounded-[1.05rem] border border-line bg-bg/60 p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="eyebrow">Full-stack surface</p>
          <p className="font-mono text-[0.68rem] text-faint">6 layers · end to end</p>
        </div>

        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-8 top-5 w-px bg-[linear-gradient(to_bottom,transparent,var(--line-strong)_8%,var(--line-strong)_92%,transparent)]"
          />
          <span aria-hidden="true" className="stack-pulse" />
          {layers.map((layer, i) => (
            <li
              key={layer.name}
              className="stack-layer relative flex items-center gap-4 py-2"
              style={{ "--i": i } as React.CSSProperties}
            >
              <Plane />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="stack-label text-[0.92rem] font-medium tracking-tight">
                    {layer.name}
                  </p>
                  <p className="hidden font-mono text-[0.64rem] text-faint sm:block">
                    {layer.note}
                  </p>
                </div>
                <p className="mt-0.5 font-mono text-[0.72rem] leading-relaxed text-muted">
                  {layer.tech.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-4 pb-2 pt-3 text-[0.8rem]">
        <span className="text-muted">
          See the layers working together in <span className="text-fg">GoodieBag</span>
        </span>
        <Link
          href="/work/goodiebag"
          className="group inline-flex shrink-0 items-center gap-1 whitespace-nowrap font-medium text-fg hover:text-accent"
        >
          Case study
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </figcaption>
    </figure>
  );
}
