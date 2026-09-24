import { engineeringTopics } from "@/content/engineering";
import { Section } from "@/components/ui/primitives";
import { Check } from "@/components/ui/icons";

export function Engineering() {
  return (
    <Section
      id="engineering"
      index="04"
      eyebrow="Engineering"
      title={
        <>
          How I build systems that{" "}
          <span className="serif-accent text-accent">hold up in production</span>.
        </>
      }
      intro={
        <p>
          Eight areas I work in, each backed by something I&apos;ve actually
          shipped — not a list of buzzwords.
        </p>
      }
    >
      <ol className="grid grid-cols-1 border-t border-line md:grid-cols-2">
        {engineeringTopics.map((topic, i) => (
          <li
            key={topic.id}
            className="reveal group border-b border-line py-8 md:px-8 md:odd:border-r md:odd:pl-0 md:even:pr-0 lg:py-10"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-xl font-semibold tracking-tight sm:text-[1.4rem]">{topic.title}</h3>
            </div>
            <p className="mt-4 leading-relaxed text-muted">{topic.body}</p>
            <ul className="mt-5 grid gap-2">
              {topic.evidence.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-fg/90">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Check size={11} strokeWidth={2.4} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[0.7rem] text-faint">{topic.tags.join("  /  ")}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
