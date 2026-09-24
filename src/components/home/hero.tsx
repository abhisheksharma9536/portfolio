import { profile } from "@/content/profile";
import { ButtonLink, ExternalLink } from "@/components/ui/primitives";
import { ArrowRight, Download, Github, Linkedin, Mail } from "@/components/ui/icons";
import { StackVisual } from "./stack-visual";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40 lg:pt-44"
    >
      {/* Ambient backdrop: masked grid + two soft accent glows. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_60%_30%,black,transparent_75%)]" />
        <div className="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
        <div className="absolute -left-40 top-64 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)]" />
      </div>

      <div className="container-page grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p
            className="animate-rise mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1.5 pl-2 pr-3.5 text-[0.8rem] text-muted backdrop-blur"
            style={delay(0)}
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-[ping-soft_2.4s_ease-out_infinite]" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            {profile.experienceYears} years shipping production software
          </p>

          <h1 id="hero-heading" className="display text-[clamp(3.4rem,17.5vw,7rem)] lg:text-[clamp(5.5rem,10.6vw,9.25rem)]">
            <span className="animate-settle block" style={delay(0)}>
              {profile.firstName}
            </span>
            <span className="animate-settle block text-fg/90" style={delay(60)}>
              {profile.lastName}
              <span className="text-accent">.</span>
            </span>
            <span className="sr-only">, {profile.title}</span>
          </h1>

          <p
            aria-hidden="true"
            className="animate-rise mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[1.35rem] font-medium tracking-tight sm:text-[1.6rem]"
            style={delay(260)}
          >
            {profile.title}
            <span className="serif-accent text-[1.15em] text-muted">
              — backend, cloud &amp; AI
            </span>
          </p>

          <p
            className="animate-rise prose-muted mt-5 max-w-xl text-[1.05rem] sm:text-lg"
            style={delay(340)}
          >
            Building production-grade web, mobile, backend and AI-powered
            systems — REST APIs on Node.js and FastAPI, PostgreSQL on AWS,
            Flutter and React apps, POS and payment integrations, and features
            built on the Claude API.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-3"
            style={delay(420)}
          >
            <ButtonLink href="/#projects" variant="primary">
              Explore My Work
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-0.5" />
            </ButtonLink>
            <a
              href={profile.resume.href}
              download={profile.resume.downloadName}
              className="group/btn inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-surface/70 px-5 text-sm font-medium text-fg backdrop-blur transition-colors hover:border-fg/30 hover:bg-surface"
            >
              <Download size={16} />
              Download Resume
            </a>
            <ButtonLink href="/#contact" variant="ghost">
              Contact Me
            </ButtonLink>
          </div>

          <ul
            aria-label="Profiles"
            className="animate-rise mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted"
            style={delay(500)}
          >
            <li>
              <ExternalLink
                href={profile.links.github}
                className="inline-flex items-center gap-2 hover:text-fg"
              >
                <Github size={16} />
                GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                href={profile.links.linkedin}
                className="inline-flex items-center gap-2 hover:text-fg"
              >
                <Linkedin size={16} />
                LinkedIn
              </ExternalLink>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 hover:text-fg"
              >
                <Mail size={16} />
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="animate-rise lg:col-span-5" style={delay(300)}>
          <StackVisual />
        </div>
      </div>

      <div className="container-page mt-16 sm:mt-20">
        <dl
          className="animate-fade grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
          style={delay(700)}
        >
          {[
            { term: "Now", detail: `${profile.currentRole} at ${profile.currentCompany}`, sub: "July 2023 – Present" },
            { term: "Flagship work", detail: "GoodieBag marketplace", sub: "200K+ users · 2,000+ restaurant partners" },
            { term: "Based in", detail: `${profile.location.city}, India`, sub: "Uttar Pradesh" },
          ].map((item) => (
            <div key={item.term} className="bg-bg/85 px-5 py-4 backdrop-blur">
              <dt className="eyebrow">{item.term}</dt>
              <dd className="mt-1.5 text-[0.95rem] font-medium tracking-tight">
                {item.detail}
                <span className="mt-0.5 block text-[0.8rem] font-normal text-muted">
                  {item.sub}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
