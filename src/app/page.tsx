import { Hero } from "@/components/home/hero";
import { Metrics } from "@/components/home/metrics";
import { TechMarquee } from "@/components/home/tech-marquee";
import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Projects } from "@/components/home/projects";
import { Engineering } from "@/components/home/engineering";
import { Skills } from "@/components/home/skills";
import { Credentials } from "@/components/home/credentials";
import { Contact } from "@/components/home/contact";
import { jsonLd, personSchema, websiteSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd([personSchema(), websiteSchema()]) }}
      />
      <Hero />
      <Metrics />
      <TechMarquee />
      <About />
      <Experience />
      <Projects />
      <Engineering />
      <Skills />
      <Credentials />
      <Contact />
    </main>
  );
}
