import type { Metadata } from "next";
import Link from "next/link";
import { goodiebag } from "@/content/projects";
import {
  apiDomains,
  awsServices,
  challenges,
  contributionAreas,
  engagementTools,
  paymentCapabilities,
  posCapabilities,
} from "@/content/goodiebag";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { jsonLd } from "@/lib/structured-data";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { WebhookFlow } from "@/components/case-study/webhook-flow";
import { CaseStudyToc, type TocItem } from "@/components/case-study/toc";
import { Arrow, Bullets, Chip, CsSection, SubSection } from "@/components/case-study/blocks";
import { AskButton } from "@/components/assistant/ask-button";
import { ButtonLink, Tag } from "@/components/ui/primitives";
import { ArrowLeft, ArrowRight, Check } from "@/components/ui/icons";

const title = "GoodieBag case study";
const description =
  "How Abhishek Sharma built the backend, Flutter app, Square and Clover POS integrations, webhook sync, Stripe payments and a Claude-powered AI chatbot for GoodieBag — a surplus food marketplace serving 200K+ users.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work/goodiebag" },
  openGraph: { type: "article", url: "/work/goodiebag", title: `${title} · ${profile.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} · ${profile.name}`, description },
};

const toc: TocItem[] = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "contribution", label: "My contribution" },
  { id: "challenges", label: "Engineering challenges" },
  {
    id: "implementation",
    label: "Implementation",
    children: [
      { id: "backend", label: "Backend & APIs" },
      { id: "performance", label: "Performance" },
      { id: "pos", label: "POS integrations" },
      { id: "webhooks", label: "Webhook sync" },
      { id: "ai", label: "AI chatbot" },
      { id: "mobile", label: "Flutter app" },
      { id: "payments", label: "Payments" },
      { id: "aws", label: "AWS" },
      { id: "engagement", label: "Analytics & engagement" },
    ],
  },
  { id: "impact", label: "Impact" },
];

const summary = [
  "Built and maintain the core Node.js/Express.js backend and developed the full Flutter app for iOS, Android and web.",
  "Integrated Square and Clover POS with webhook-based sync — nearly 90% less partner operational effort.",
  "Improved API response time by 40% with PostgreSQL query optimization and targeted indexes.",
  "Built an AI chatbot service with Python, FastAPI and the Anthropic Claude API.",
  "Integrated Stripe payments and payouts; wrote AWS Lambda functions with S3 and Cognito; added PostHog, FCM and Customer.io.",
];

function breadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/#projects` },
      { "@type": "ListItem", position: 3, name: "GoodieBag", item: `${siteUrl}/work/goodiebag` },
    ],
  };
}

export default function GoodieBagCaseStudy() {
  return (
    <main id="main" className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema()) }} />

      {/* Hero */}
      <header className="relative isolate overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_20%,black,transparent_75%)]" />
          <div className="absolute -left-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
        </div>
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="animate-rise mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-fg">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#projects" className="hover:text-fg">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg">
                GoodieBag
              </li>
            </ol>
          </nav>

          <p className="eyebrow animate-rise" style={{ "--delay": "60ms" } as React.CSSProperties}>
            Case study · Client project at XORLABS
          </p>
          <h1
            className="display animate-settle mt-5 text-[clamp(3.5rem,13vw,8.5rem)]"
            style={{ "--delay": "120ms" } as React.CSSProperties}
          >
            GoodieBag
          </h1>
          <p
            className="animate-rise mt-6 max-w-3xl text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium leading-snug tracking-tight text-fg/85"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            A surplus food marketplace on iOS, Android and web —{" "}
            <span className="serif-accent text-accent">and the backend, integrations and AI</span> that run it.
          </p>

          <dl
            className="animate-rise mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
            style={{ "--delay": "280ms" } as React.CSSProperties}
          >
            {[
              ["My role", "Software Engineer, XORLABS"],
              ["Timeline", goodiebag.period],
              ["Platforms", goodiebag.platforms?.join(" · ") ?? ""],
              ["Scale", "200K+ users · 2,000+ partners"],
            ].map(([term, detail]) => (
              <div key={term} className="bg-bg/90 px-5 py-4 backdrop-blur">
                <dt className="eyebrow">{term}</dt>
                <dd className="mt-1.5 text-[0.95rem] font-medium tracking-tight">{detail}</dd>
              </div>
            ))}
          </dl>

          <section
            aria-labelledby="summary-title"
            className="animate-rise card mt-6 grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12"
            style={{ "--delay": "340ms" } as React.CSSProperties}
          >
            <div className="lg:col-span-7">
              <h2 id="summary-title" className="eyebrow text-accent">
                In 60 seconds
              </h2>
              <ul className="mt-4 grid gap-3">
                {summary.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <Check size={11} strokeWidth={2.4} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <p className="eyebrow">Stack</p>
              <ul aria-label="GoodieBag stack" className="mt-4 flex flex-wrap gap-1.5">
                {goodiebag.stack.map((tech) => (
                  <li key={tech}>
                    <Tag>{tech}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </header>

      <div className="container-page grid grid-cols-1 gap-12 pb-24 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <CaseStudyToc items={toc} />
          </div>
        </aside>

        <article className="min-w-0 lg:col-span-9">
          <CsSection
            id="problem"
            index="01 — Problem"
            title="A marketplace serves two audiences — and partners already have a system of record."
            lead={
              <p>
                GoodieBag connects customers with restaurant partners selling surplus food. That creates
                engineering needs on both sides of the marketplace, and underneath it.
              </p>
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  who: "Customers",
                  need: "Discover stores and order on iOS, Android or the web, with checkout, refunds and failures handled correctly — and order tracking after purchase.",
                },
                {
                  who: "Restaurant partners",
                  need: "Their locations, catalog, inventory and orders already live in Square or Clover. Re-entering that data in a second system is operational effort — and friction for new partners.",
                },
                {
                  who: "The platform",
                  need: "APIs that stay fast under high-concurrency load, and data that stays consistent across POS, backend and storefront in real time.",
                },
              ].map((item) => (
                <div key={item.who} className="rounded-2xl border border-line bg-surface p-5">
                  <p className="font-semibold tracking-tight">{item.who}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{item.need}</p>
                </div>
              ))}
            </div>
          </CsSection>

          <CsSection
            id="solution"
            index="02 — Solution"
            title="One Flutter app, one Node.js platform, and integrations that meet partners where they already work."
            lead={
              <p>
                Customers use a single Flutter app across iOS, Android and web. Behind it, a Node.js/Express.js
                backend exposes REST APIs for authentication, catalog, ordering and partner management, backed by
                PostgreSQL and AWS. Square and Clover integrations with webhook-based sync let partners keep
                running their business from their existing POS, Stripe handles payments and payouts, and an AI
                chatbot service on the Claude API answers customer and partner queries.
              </p>
            }
          >
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
              {[
                ["Cross-platform app", "Flutter on iOS, Android and web from a single codebase."],
                ["Integrated platform", "Node.js/Express.js APIs over PostgreSQL, with AWS for files, jobs and auth."],
                ["Partner-native operations", "Square and Clover as the source of truth, synchronized through webhooks."],
              ].map(([name, body]) => (
                <div key={name} className="bg-bg p-5 sm:p-6">
                  <p className="font-semibold tracking-tight">{name}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </CsSection>

          <CsSection
            id="architecture"
            index="03 — Architecture"
            title="How the system fits together."
            lead={<p>A simplified view of the components I worked on. Select any component to see its role and connections.</p>}
          >
            <div className="card rounded-[1.4rem] p-4 sm:p-6">
              <ArchitectureDiagram />
            </div>
          </CsSection>

          <CsSection id="contribution" index="04 — My contribution" title="What I built.">
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {contributionAreas.map((group) => (
                <div key={group.area}>
                  <p className="eyebrow mb-3 text-accent">{group.area}</p>
                  <Bullets items={group.items.map((i) => goodiebag.contributions[i])} />
                </div>
              ))}
            </div>
          </CsSection>

          <CsSection
            id="challenges"
            index="05 — Engineering challenges"
            title="The hard parts, and how I approached them."
          >
            <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {challenges.map((item, i) => (
                <li key={item.title} className="card flex flex-col p-6">
                  <p className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg font-semibold tracking-tight">{item.title}</span>
                  </p>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                    <span className="eyebrow mr-2 inline-block">Challenge</span>
                    {item.challenge}
                  </p>
                  <p className="mt-3 border-t border-line pt-3 text-[0.95rem] leading-relaxed text-fg/90">
                    <span className="eyebrow mr-2 inline-block text-accent">Approach</span>
                    {item.approach}
                  </p>
                </li>
              ))}
            </ol>
          </CsSection>

          <CsSection
            id="implementation"
            index="06 — Technical implementation"
            title="Inside the build."
            lead={<p>Each area below maps to work I did on GoodieBag.</p>}
          >
            <div className="divide-y divide-line">
              <SubSection id="backend" kicker="Backend · Node.js / Express.js" title="Core backend & REST APIs">
                <p className="max-w-3xl leading-relaxed text-muted">
                  I built and maintain the core Node.js/Express.js backend for a marketplace serving 200K+ users.
                  Its REST APIs cover four domains:
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {apiDomains.map((domain) => (
                    <Chip key={domain}>{domain}</Chip>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["Validation middleware", "Requests are validated before they reach business logic."],
                    ["JWT authentication", "Consistent authentication across services."],
                    ["Structured error handling", "Structured, consistent error responses across services."],
                  ].map(([name, body]) => (
                    <div key={name} className="rounded-2xl border border-line bg-surface p-5">
                      <p className="font-medium tracking-tight">{name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-faint">Applied across services to improve API reliability.</p>
              </SubSection>

              <SubSection id="performance" kicker="Performance · PostgreSQL" title="40% API response-time improvement">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
                  <p className="display text-[clamp(4.5rem,12vw,7.5rem)] leading-none text-accent">40%</p>
                  <div>
                    <p className="max-w-xl leading-relaxed text-muted">
                      API response time improved by 40% under high-concurrency load — from two changes at the
                      data layer:
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Chip active>PostgreSQL query optimization</Chip>
                      <span aria-hidden="true" className="text-faint">+</span>
                      <Chip active>Targeted indexes</Chip>
                    </div>
                  </div>
                </div>
              </SubSection>

              <SubSection
                id="pos"
                kicker="Integrations · Square & Clover"
                title="POS integrations"
                aside={
                  <p className="rounded-2xl border border-accent/30 bg-accent-soft px-5 py-3 text-accent">
                    <span className="display block text-4xl">~90%</span>
                    <span className="text-sm">less partner operational effort</span>
                  </p>
                }
              >
                <p className="max-w-3xl leading-relaxed text-muted">
                  I integrated Square and Clover POS so 2,000+ restaurant partners manage their business from the
                  POS they already use. Less duplicate work reduced partner operational effort by nearly 90% and
                  helped drive new partner acquisition.
                </p>
                <div className="mt-8 grid grid-cols-1 items-center gap-4 rounded-[1.4rem] border border-line bg-subtle/50 p-5 sm:p-7 md:grid-cols-[1fr_auto_1.3fr]">
                  <div className="grid gap-3">
                    {["Square POS", "Clover POS"].map((pos) => (
                      <div key={pos} className="rounded-xl border border-dashed border-line-strong bg-bg px-4 py-3">
                        <p className="font-medium">{pos}</p>
                        <p className="font-mono text-[0.68rem] text-faint">Partner system of record</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2 font-mono text-[0.68rem] text-faint">
                    <span className="hidden md:inline">webhooks + API</span>
                    <span aria-hidden="true" className="text-lg text-accent md:rotate-0">
                      <span className="md:hidden">↓</span>
                      <span className="hidden md:inline">⇄</span>
                    </span>
                    <span className="md:hidden">webhooks + API</span>
                  </div>
                  <div className="rounded-xl border border-accent/35 bg-surface p-4">
                    <p className="font-medium">GoodieBag backend</p>
                    <ul className="mt-3 grid gap-2">
                      {posCapabilities.map((cap) => (
                        <li key={cap.name} className="flex items-start gap-2.5 text-sm">
                          <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                          <span>
                            <span className="font-medium">{cap.name}</span>
                            <span className="text-muted"> — {cap.note}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SubSection>

              <SubSection id="webhooks" kicker="Data consistency · Webhooks" title="Real-time catalog & inventory sync">
                <p className="mb-8 max-w-3xl leading-relaxed text-muted">
                  Webhook-based catalog and inventory synchronization keeps data consistent between POS systems,
                  the backend and the storefront. Follow a change through the pipeline:
                </p>
                <WebhookFlow />
              </SubSection>

              <SubSection id="ai" kicker="AI · Anthropic Claude API" title="AI chatbot service">
                <p className="max-w-3xl leading-relaxed text-muted">
                  I built an AI chatbot service in Python and FastAPI using the Anthropic Claude API. It&apos;s
                  integrated with the Node.js backend and the Flutter app, and handles both customer and partner
                  queries.
                </p>
                <div className="mt-8 grid grid-cols-1 items-center gap-3 rounded-[1.4rem] border border-line bg-subtle/50 p-5 sm:p-7 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  <div className="grid gap-2">
                    <Chip>Flutter app</Chip>
                    <Chip>Node.js backend</Chip>
                  </div>
                  <Arrow />
                  <div className="rounded-xl border border-accent/35 bg-surface p-4">
                    <p className="font-medium">AI chatbot service</p>
                    <p className="font-mono text-[0.68rem] text-faint">Python · FastAPI</p>
                  </div>
                  <Arrow />
                  <div className="rounded-xl border border-dashed border-line-strong bg-bg p-4">
                    <p className="font-medium">Claude API</p>
                    <p className="font-mono text-[0.68rem] text-faint">Anthropic</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-relaxed text-muted">
                    The <span className="text-fg">Ask Abhishek</span> assistant on this site is a separate, smaller
                    build: it answers only from a structured knowledge base generated from this portfolio&apos;s content.
                  </p>
                  <AskButton question="What AI experience does Abhishek have?" className="shrink-0">
                    Try it
                  </AskButton>
                </div>
              </SubSection>

              <SubSection id="mobile" kicker="Mobile · Flutter & Dart" title="One codebase, three platforms">
                <p className="max-w-3xl leading-relaxed text-muted">
                  I developed the full Flutter app across iOS, Android and web from a single codebase — with reusable
                  widgets, state management and the complete flow from store discovery to order tracking.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-line bg-subtle/50 p-5 sm:p-6">
                    <p className="eyebrow">Single codebase</p>
                    <div className="mt-4 rounded-xl border border-accent/35 bg-surface p-3 text-center font-medium">
                      Flutter · Dart
                    </div>
                    <Arrow vertical />
                    <div className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
                      {goodiebag.platforms?.map((platform) => (
                        <span key={platform} className="rounded-xl border border-line bg-bg px-2 py-2.5">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.4rem] border border-line bg-subtle/50 p-5 sm:p-6">
                    <p className="eyebrow">Customer journey</p>
                    <ol className="mt-4 grid gap-2">
                      {["Store discovery", "Checkout", "Order tracking"].map((stepName, i) => (
                        <li key={stepName} className="flex items-center gap-3 rounded-xl border border-line bg-bg px-4 py-2.5">
                          <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-medium">{stepName}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-sm text-muted">Built with reusable widgets and state management.</p>
                  </div>
                </div>
              </SubSection>

              <SubSection id="payments" kicker="Payments · Stripe" title="Payments & partner payouts">
                <p className="max-w-3xl leading-relaxed text-muted">
                  I integrated Stripe for customer payments and partner payouts, including the parts that matter when
                  things go wrong.
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {paymentCapabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium">
                      <Check size={15} className="shrink-0 text-accent" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </SubSection>

              <SubSection id="aws" kicker="Cloud · AWS" title="Serverless jobs, media and auth">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {awsServices.map((service) => (
                    <div key={service.name} className="rounded-2xl border border-line bg-surface p-5">
                      <p className="font-semibold tracking-tight">{service.name}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{service.role}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-faint">Services are packaged with Docker.</p>
              </SubSection>

              <SubSection id="engagement" kicker="Analytics & engagement" title="Measuring and re-engaging">
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                  {engagementTools.map((tool) => (
                    <li key={tool.name} className="bg-bg px-5 py-4">
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-muted">{tool.role}</p>
                    </li>
                  ))}
                </ul>
              </SubSection>
            </div>
          </CsSection>

          <CsSection id="impact" index="07 — Impact" title="What it added up to.">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
              {goodiebag.metrics?.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse bg-bg p-5 sm:p-6">
                  <dt className="mt-2 text-sm leading-snug text-muted">{metric.label}</dt>
                  <dd className="display text-[clamp(2.2rem,5vw,3.25rem)] leading-none">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <Bullets
              className="mt-8"
              items={[
                "POS integrations drove new partner acquisition by letting restaurants work from their existing POS.",
                "Catalog and inventory stay consistent across POS, backend and storefront in real time.",
                "iOS, Android and web ship from one Flutter codebase.",
                "Customers and partners get answers from an AI chatbot built on the Claude API.",
              ]}
            />
          </CsSection>

          <div className="card mt-4 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xl font-semibold tracking-tight">Want to go deeper on any of this?</p>
              <p className="mt-1 text-muted">Ask the assistant, or get in touch directly.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AskButton question="How did Abhishek build the POS integrations for GoodieBag?">Ask about the POS work</AskButton>
              <ButtonLink href="/#contact">
                Contact
                <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="More work" className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link href="/#projects" className="inline-flex items-center gap-2 text-muted hover:text-fg">
              <ArrowLeft size={16} />
              Back to all work
            </Link>
            <div className="flex gap-4">
              <Link href="/#avery-telehealth" className="text-muted hover:text-fg">
                Avery Telehealth
              </Link>
              <Link href="/#code-analyzer" className="text-muted hover:text-fg">
                Code Analyzer
              </Link>
            </div>
          </nav>
        </article>
      </div>
    </main>
  );
}
