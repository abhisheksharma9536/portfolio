import { profile } from "@/content/profile";
import { education } from "@/content/credentials";
import { Section } from "@/components/ui/primitives";

const facts = [
  { label: "Role", value: `${profile.currentRole}, ${profile.currentCompany}` },
  { label: "Experience", value: `${profile.experienceYears} years · since ${profile.careerStart}` },
  { label: "Location", value: profile.location.display },
  { label: "Education", value: `${education.degree} ${education.field} · CGPA ${education.cgpa}` },
  { label: "Domains", value: profile.domains.join(" · ") },
];

const ways = [
  {
    title: "Requirements to release",
    body: "I work directly with clients on requirement gathering, scoping, demos and release planning — then support what ships in production.",
  },
  {
    title: "Across the whole stack",
    body: "Backend services, APIs and databases, cloud infrastructure, cross-platform mobile and web apps, and the integrations that connect them.",
  },
  {
    title: "With the team",
    body: "Cross-functional collaboration in Agile/Scrum, with AI coding tools like Claude Code and GitHub Copilot in my day-to-day workflow.",
  },
];

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          An engineer who builds systems that{" "}
          <span className="serif-accent text-accent">solve real business problems</span>
          {" "}— and stays with them into production.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="reveal space-y-5 text-[1.05rem] leading-[1.75] text-muted lg:col-span-7 sm:text-lg">
          <p>
            I&apos;m a Full Stack Developer with {profile.experienceYears} years of
            building and shipping production software — currently a Software
            Engineer at XORLABS. My work spans{" "}
            <span className="text-fg">Node.js and Python/FastAPI backends</span>, REST APIs,{" "}
            <span className="text-fg">PostgreSQL and MongoDB</span>, AWS, and{" "}
            <span className="text-fg">Flutter and React</span> apps — including AI features
            built on the Anthropic Claude API.
          </p>
          <p>
            A lot of that work happens where systems meet: point-of-sale platforms,
            payment providers, messaging and analytics tools, and LLM APIs. On
            GoodieBag, a marketplace serving 200K+ users, integrating Square and Clover
            POS reduced partner operational effort by nearly 90%, and PostgreSQL
            query optimization with targeted indexes improved API response times
            by 40%.
          </p>

          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line pt-0 sm:grid-cols-3">
            {ways.map((way) => (
              <li key={way.title} className="bg-bg p-5">
                <p className="text-[0.95rem] font-medium tracking-tight text-fg">
                  {way.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{way.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside aria-label="Quick facts" className="reveal lg:col-span-5">
          <dl className="card divide-y divide-line overflow-hidden">
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[7rem_1fr] gap-4 px-5 py-4 sm:px-6">
                <dt className="eyebrow pt-0.5">{fact.label}</dt>
                <dd className="text-[0.95rem] leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
