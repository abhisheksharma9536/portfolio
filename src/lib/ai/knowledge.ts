import { profile } from "@/content/profile";
import { roles } from "@/content/experience";
import { averyTelehealth, codeAnalyzer, goodiebag, type Project } from "@/content/projects";
import {
  architectureNodes,
  awsServices,
  engagementTools,
  paymentCapabilities,
  posCapabilities,
  webhookFlow,
} from "@/content/goodiebag";
import { metrics } from "@/content/metrics";
import { skillCategories } from "@/content/skills";
import { achievements, certifications, education } from "@/content/credentials";

/**
 * Builds the assistant's knowledge base from the same content modules that
 * render the website, so the site and the assistant can never disagree.
 * Output is deterministic (no timestamps) so it stays prompt-cacheable.
 */

function bullets(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function projectBlock(project: Project, extra = "") {
  return [
    `## ${project.name} — ${project.tagline} (${project.period})`,
    project.platforms ? `Platforms: ${project.platforms.join(", ")}` : "",
    `Technologies: ${project.stack.join(", ")}`,
    `Summary: ${project.summary}`,
    "What Abhishek did:",
    bullets(project.contributions),
    extra,
  ]
    .filter(Boolean)
    .join("\n");
}

const goodiebagDetails = [
  "GoodieBag architecture (components and their roles):",
  bullets(architectureNodes.map((n) => `${n.label} (${n.sub}): ${n.description}`)),
  `Webhook-based sync flow: ${webhookFlow.map((s) => s.label).join(" → ")}.`,
  bullets(webhookFlow.map((s) => `${s.label} (${s.sub}): ${s.role}`)),
  `POS capabilities (Square and Clover): ${posCapabilities.map((c) => c.name).join(", ")}.`,
  `Stripe capabilities: ${paymentCapabilities.join(", ")}.`,
  `AWS: ${awsServices.map((s) => `${s.name} — ${s.role}`).join(" ")}`,
  `Analytics & engagement: ${engagementTools.map((t) => `${t.name} (${t.role})`).join(", ")}.`,
  "Scale context: 200K+ users and 2,000+ restaurant partners describe the GoodieBag marketplace — not Abhishek's whole career.",
  "The resume does not give benchmark methodology, before/after latency figures, traffic volumes, team size or dates beyond '2023 – Present'.",
].join("\n");

export function buildKnowledgeBase(): string {
  return [
    "Note: some entries reuse first-person website copy — \"I\" in this knowledge base always means Abhishek.",
    "",
    "# Profile",
    `Name: ${profile.name}`,
    `Primary title: ${profile.title}`,
    `Positioning: ${profile.positioning}`,
    `Experience: ${profile.experienceYears} years of professional software engineering (since ${profile.careerStart})`,
    `Current role: ${profile.currentRole} at ${profile.currentCompany}`,
    `Location: ${profile.location.display}`,
    `Work domains: ${profile.domains.join(", ")}`,
    "",
    "# Professional summary",
    profile.longSummary.join(" "),
    "",
    "# Experience (all at XORLABS — the only employer listed)",
    ...roles.map((role) =>
      [
        `## ${role.title} — ${role.company}, ${role.location} (${role.start} – ${role.end})`,
        role.summary,
        bullets([...role.highlights, ...role.details]),
      ].join("\n"),
    ),
    "",
    "# Projects (listed as client projects on the resume)",
    projectBlock(goodiebag, goodiebagDetails),
    "",
    projectBlock(averyTelehealth),
    "",
    projectBlock(codeAnalyzer),
    "",
    "# Metrics (each is scoped — never generalize a project metric to the whole career)",
    bullets(
      metrics.map(
        (m) => `${m.prefix ?? ""}${m.grouped ? m.value.toLocaleString("en-US") : m.value}${m.suffix ?? ""} ${m.label} — scope: ${m.scope}. ${m.context}`,
      ),
    ),
    "",
    "# Skills (from the resume)",
    ...skillCategories.map((c) => `${c.name}: ${c.skills.join(", ")}. Where used: ${c.context}`),
    "Also used on Code Analyzer: Java, parsers, Abstract Syntax Trees, rule engine, SQL, Git.",
    "",
    "# Certifications",
    bullets(certifications.map((c) => `${c.name} — ${c.issuer}, ${c.year}. Verify: ${c.verifyUrl}`)),
    "",
    "# Achievements",
    bullets(achievements.map((a) => `${a.title}: ${a.highlight} (${a.period}). ${a.detail}`)),
    "",
    "# Education",
    `${education.institution} — ${education.degree}, ${education.field} (${education.period}). CGPA: ${education.cgpa}.`,
    "",
    "# Contact",
    `Email: ${profile.email}`,
    `Phone: ${profile.phone.display}`,
    `LinkedIn: ${profile.links.linkedin}`,
    `GitHub: ${profile.links.github} (username ${profile.links.githubUsername})`,
    `Resume (PDF): ${profile.resume.href}`,
    "",
    "# About this website",
    "Built with Next.js, TypeScript and Tailwind CSS. This assistant calls the Anthropic Claude API server-side and answers only from this knowledge base, which is generated from the same content files that render the site.",
    "",
    "# Not in the portfolio",
    "The portfolio contains no information about: salary or compensation, notice period, current job-search status or availability, visa or relocation, age or personal life, references, team sizes, employers other than XORLABS, detailed GitHub statistics, or any metric not listed above.",
  ].join("\n");
}
