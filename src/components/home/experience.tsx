import Link from "next/link";
import { roles } from "@/content/experience";
import { profile } from "@/content/profile";
import { Section, Tag } from "@/components/ui/primitives";
import { ArrowUpRight, ChevronDown } from "@/components/ui/icons";

const clientWork = [
  { name: "GoodieBag", domain: "Food marketplace", href: "/work/goodiebag" },
  { name: "Avery Telehealth", domain: "Healthcare", href: "/#avery-telehealth" },
  { name: "Code Analyzer", domain: "Developer tooling", href: "/#code-analyzer" },
];

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title={
        <>
          {profile.experienceYears} years at XORLABS — from parsers and test cases to{" "}
          <span className="serif-accent text-accent">owning production features end to end</span>.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <aside className="reveal order-2 lg:order-1 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="text-3xl font-semibold tracking-tight">XORLABS</p>
            <p className="mt-1 text-sm text-muted">
              {roles[0].location} · {profile.careerStart} – Present
            </p>

            <ol aria-label="Career progression" className="mt-8 grid gap-3">
              {[...roles].reverse().map((role, i) => (
                <li key={role.id} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`grid size-7 place-items-center rounded-full border font-mono text-[0.65rem] ${
                      i === roles.length - 1
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line-strong text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[0.95rem] font-medium tracking-tight">
                    {role.title}
                  </span>
                  <span className="ml-auto font-mono text-[0.7rem] text-faint">
                    {role.startDate.slice(0, 4)}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <p className="eyebrow mb-3">Client work</p>
              <ul className="grid gap-2">
                {clientWork.map((work) => (
                  <li key={work.name}>
                    <Link
                      href={work.href}
                      className="group flex items-center justify-between rounded-xl border border-line px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface"
                    >
                      <span>
                        <span className="block text-[0.92rem] font-medium">{work.name}</span>
                        <span className="block text-xs text-muted">{work.domain}</span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <ol className="relative order-1 lg:order-2 lg:col-span-8">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[0.6rem] top-3 w-px bg-line-strong sm:left-[0.7rem]"
          />
          {roles.map((role) => {
            const current = role.endDate === null;
            return (
              <li key={role.id} className="reveal relative pb-12 pl-10 last:pb-0 sm:pl-12">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 grid size-5 place-items-center rounded-full border sm:size-6 ${
                    current ? "border-accent bg-accent-soft" : "border-line-strong bg-bg"
                  }`}
                >
                  <span className={`size-2 rounded-full ${current ? "bg-accent" : "bg-line-strong"}`} />
                </span>

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
                    {role.title}
                  </h3>
                  <p className="font-mono text-[0.78rem] text-muted">
                    <time dateTime={role.startDate}>{role.start}</time> –{" "}
                    {role.endDate ? <time dateTime={role.endDate}>{role.end}</time> : role.end}
                  </p>
                </div>
                <p className="mt-1 text-sm text-faint">
                  {role.company} · {role.location}
                  {current ? (
                    <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[0.7rem] font-medium text-accent">
                      Current
                    </span>
                  ) : null}
                </p>

                <p className="mt-5 text-[1.05rem] leading-relaxed text-fg/90">{role.summary}</p>

                <ul className="mt-5 grid gap-3">
                  {role.highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                {role.details.length > 0 ? (
                  <details className="group mt-4">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full text-sm font-medium text-fg hover:text-accent [&::-webkit-details-marker]:hidden">
                      <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                      <span className="group-open:hidden">More responsibilities</span>
                      <span className="hidden group-open:inline">Show less</span>
                    </summary>
                    <ul className="mt-4 grid gap-3">
                      {role.details.map((item) => (
                        <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-line-strong" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                <ul aria-label={`${role.title} stack`} className="mt-6 flex flex-wrap gap-1.5">
                  {role.stack.map((tech) => (
                    <li key={tech}>
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
