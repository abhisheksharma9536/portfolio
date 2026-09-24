import { achievements, certifications, education } from "@/content/credentials";
import { ExternalLink, Section } from "@/components/ui/primitives";
import { ArrowUpRight, Award, BadgeCheck, GraduationCap, Trophy } from "@/components/ui/icons";

export function Credentials() {
  return (
    <Section
      id="achievements"
      index="06"
      eyebrow="Achievements & credentials"
      title={
        <>
          Recognition, certifications{" "}
          <span className="serif-accent text-accent">and foundations</span>.
        </>
      }
    >
      <div className="grid gap-6">
        <div className="reveal grid grid-cols-1 gap-6 md:grid-cols-2">
          {achievements.map((item, i) => {
            const Icon = i === 0 ? Award : Trophy;
            return (
              <article key={item.title} className="card flex flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-subtle text-accent">
                    <Icon size={20} />
                  </span>
                  <span className="font-mono text-xs text-faint">{item.period}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] font-medium leading-tight tracking-tight text-accent">
                  {item.highlight}
                </p>
                <p className="mt-3 text-[0.95rem] text-muted">{item.detail}</p>
              </article>
            );
          })}
        </div>

        <div className="reveal grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="card p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow">Certifications</p>
              <p className="text-sm text-muted">Claude Academy · 2026</p>
            </div>
            <ul className="mt-6 grid gap-3">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <ExternalLink
                    href={cert.verifyUrl}
                    className="group flex items-center gap-4 rounded-xl border border-line bg-bg px-4 py-3.5 transition-colors hover:border-accent/40"
                  >
                    <BadgeCheck size={20} className="shrink-0 text-accent" />
                    <span className="min-w-0 flex-1 font-medium leading-snug tracking-tight">{cert.name}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted group-hover:text-accent">
                      Verify
                      <ArrowUpRight size={13} />
                    </span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>

          <article className="card flex flex-col p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-center justify-between gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-subtle text-accent">
                <GraduationCap size={20} />
              </span>
              <span className="font-mono text-xs text-faint">{education.period}</span>
            </div>
            <p className="eyebrow mt-8">Education</p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{education.institution}</h3>
            <p className="mt-1 text-[0.95rem] text-muted">
              {education.degree}, {education.field}
            </p>
            <div className="mt-auto pt-6">
              <p className="inline-flex items-baseline gap-2 rounded-full border border-line px-3 py-1 text-sm">
                <span className="text-muted">CGPA</span>
                <span className="font-semibold">{education.cgpa}</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
