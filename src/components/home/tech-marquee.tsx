import { marqueeTech } from "@/content/skills";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {marqueeTech.map((tech) => (
        <li
          key={tech}
          className="flex items-center whitespace-nowrap px-6 text-[1.05rem] font-medium tracking-tight text-muted sm:px-8 sm:text-xl"
        >
          <span aria-hidden="true" className="mr-6 text-[0.7rem] text-accent/70 sm:mr-8">
            ◆
          </span>
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** A quiet band of the technologies from the resume. Pauses on hover and under reduced motion. */
export function TechMarquee() {
  return (
    <section aria-label="Technologies I work with" className="marquee relative border-y border-line py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
