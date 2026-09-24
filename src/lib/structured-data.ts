import { profile } from "@/content/profile";
import { education } from "@/content/credentials";
import { siteConfig, siteUrl } from "@/lib/site";

/** Serializes JSON-LD safely for inline <script> tags. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.title,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    worksFor: { "@type": "Organization", name: profile.currentCompany },
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: profile.location.countryCode,
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: [
      "Full-stack development",
      "Node.js",
      "Express.js",
      "Python",
      "FastAPI",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Flutter",
      "React",
      "Anthropic Claude API",
      "LLM integration",
      "POS integrations",
      "Webhooks",
      "Stripe",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en",
    author: { "@id": `${siteUrl}/#person` },
  };
}
