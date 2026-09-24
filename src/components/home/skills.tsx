import { skillCategories } from "@/content/skills";
import { Section } from "@/components/ui/primitives";
import { SkillsTabs } from "./skills-tabs";

export function Skills() {
  return (
    <Section
      id="skills"
      index="05"
      eyebrow="Skills"
      title={
        <>
          A toolkit organized by{" "}
          <span className="serif-accent text-accent">where it gets used</span>.
        </>
      }
      intro={
        <p>
          Grouped into {skillCategories.length} areas, each paired with the work
          where it shows up.
        </p>
      }
    >
      <div className="reveal">
        <SkillsTabs />
      </div>
    </Section>
  );
}
