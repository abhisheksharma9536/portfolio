import Link from "next/link";
import { averyTelehealth, codeAnalyzer, goodiebag, type Project } from "@/content/projects";
import { ButtonLink, Section, Tag } from "@/components/ui/primitives";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { AskButton } from "@/components/assistant/ask-button";

const highlights = [
  { title: "Core backend & REST APIs", body: "Node.js/Express.js APIs for authentication, catalog, ordering and partner management.", anchor: "backend" },
  { title: "40% response-time gain", body: "PostgreSQL query optimization and targeted indexes for high-concurrency load.", anchor: "performance" },
  { title: "Square & Clover POS", body: "Partners run locations, catalog, inventory and orders from their existing POS.", anchor: "pos" },
  { title: "Real-time webhook sync", body: "Catalog and inventory stay consistent across POS, backend and storefront.", anchor: "webhooks" },
  { title: "AI chatbot on Claude", body: "A Python/FastAPI service answering customer and partner queries.", anchor: "ai" },
  { title: "Flutter on 3 platforms", body: "iOS, Android and web from one codebase — discovery to order tracking.", anchor: "mobile" },
  { title: "Stripe payments & payouts", body: "Checkout, payment webhooks, refunds, failure handling and payouts.", anchor: "payments" },
  { title: "AWS serverless", body: "Lambda for files and background jobs, S3 for media, Cognito for auth.", anchor: "aws" },
];

function FlowChips({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-y-2 font-mono text-[0.7rem]">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center">
          <span className="rounded-md border border-line bg-bg px-2 py-1 text-muted">{step}</span>
          {i < steps.length - 1 ? (
            <span aria-hidden="true" className="px-1.5 text-faint">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function ProjectCard({ project, flow, flowLabel }: { project: Project; flow: string[]; flowLabel: string }) {
  return (
    <article
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      className="reveal card group flex scroll-mt-28 flex-col p-6 transition-shadow hover:shadow-lifted sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{project.period}</p>
          <h4 id={`${project.slug}-title`} className="mt-3 text-2xl font-semibold tracking-tight">
            {project.name}
          </h4>
          <p className="mt-1 text-[0.95rem] text-muted">{project.tagline}</p>
        </div>
        {project.metrics?.[0] ? (
          <p className="shrink-0 text-right">
            <span className="display block text-4xl">{project.metrics[0].value}</span>
            <span className="mt-1 block max-w-[8rem] text-xs text-muted">{project.metrics[0].label}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-subtle/60 p-4">
        <FlowChips steps={flow} label={flowLabel} />
      </div>

      <p className="mt-6 leading-relaxed text-fg/90">{project.summary}</p>
      <ul className="mt-4 grid gap-2.5">
        {project.contributions.map((item) => (
          <li key={item} className="flex gap-3 text-[0.94rem] leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-accent" />
            {item}
          </li>
        ))}
      </ul>
      <ul aria-label={`${project.name} stack`} className="mt-auto flex flex-wrap gap-1.5 pt-7">
        {project.stack.map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Selected work"
      title={
        <>
          GoodieBag: one marketplace,{" "}
          <span className="serif-accent text-accent">every layer of the stack</span>.
        </>
      }
      intro={
        <p>
          The project that best represents my work — a surplus food marketplace on
          iOS, Android and web where I built the backend, the Flutter app, the POS
          and payment integrations, and the AI chatbot.
        </p>
      }
    >
      <article aria-labelledby="goodiebag-title" className="reveal card overflow-hidden rounded-[1.6rem] shadow-soft">
        <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-accent-fg">
                Featured
              </span>
              <Tag>{goodiebag.period}</Tag>
              <Tag>{goodiebag.platforms?.join(" · ")}</Tag>
            </div>
            <h3 id="goodiebag-title" className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              {goodiebag.name}
            </h3>
            <p className="mt-2 text-lg text-muted">
              {goodiebag.tagline} · client project at XORLABS
            </p>
            <p className="mt-6 max-w-xl leading-relaxed text-fg/90">{goodiebag.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/work/goodiebag">
                Read the case study
                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" />
              </ButtonLink>
              <AskButton question="Tell me about GoodieBag.">Ask about GoodieBag</AskButton>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl border border-line bg-line lg:col-span-6">
            {goodiebag.metrics?.map((metric) => (
              <div key={metric.label} className="flex flex-col-reverse bg-bg p-5 sm:p-6">
                <dt className="mt-2 text-sm leading-snug text-muted">{metric.label}</dt>
                <dd className="display text-[clamp(2.4rem,6vw,3.6rem)] leading-none">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-line bg-subtle/40 p-4 sm:p-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2 px-1">
            <div>
              <p className="eyebrow">System architecture</p>
              <p className="mt-1.5 text-lg font-medium tracking-tight">How the pieces connect</p>
            </div>
            <p className="text-sm text-faint">Hover, focus or tap a component</p>
          </div>
          <ArchitectureDiagram />
        </div>

        <ul className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li key={item.anchor} className="bg-surface">
              <Link
                href={`/work/goodiebag#${item.anchor}`}
                className="group flex h-full flex-col p-5 transition-colors hover:bg-subtle/60 sm:p-6"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[0.97rem] font-medium tracking-tight">{item.title}</span>
                  <ArrowUpRight
                    size={16}
                    className="mt-0.5 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </article>

      <div className="mt-20 sm:mt-24">
        <div className="reveal mb-8 flex items-end justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">More client work</h3>
          <p className="hidden max-w-xs text-right text-sm text-muted sm:block">
            Healthcare portals and a static-analysis engine.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProjectCard
            project={averyTelehealth}
            flowLabel="Avery Telehealth request flow"
            flow={["Provider & patient portals", "RBAC", "REST APIs", "MongoDB"]}
          />
          <ProjectCard
            project={codeAnalyzer}
            flowLabel="Code Analyzer analysis pipeline"
            flow={["Source code", "Parser", "AST", "Rule engine", "Detections"]}
          />
        </div>
      </div>
    </Section>
  );
}
