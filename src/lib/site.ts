import { profile } from "@/content/profile";

/**
 * Resolves the canonical site URL.
 *
 * 1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is attached.
 * 2. VERCEL_PROJECT_PRODUCTION_URL — provided by Vercel at build and runtime,
 *    always the project's production domain (never a preview URL).
 * 3. localhost for local development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${vercelProduction.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const siteConfig = {
  name: profile.name,
  title: `${profile.name} — Full Stack Developer`,
  description:
    "Abhishek Sharma is a Full Stack Developer with 4+ years of experience building production systems with Node.js, Python/FastAPI, PostgreSQL, AWS, React, Flutter and the Claude API — including a marketplace serving 200K+ users.",
  keywords: [
    "Abhishek Sharma",
    "Full Stack Developer",
    "Software Engineer",
    "Node.js Developer",
    "Python Developer",
    "FastAPI",
    "React Developer",
    "Flutter Developer",
    "Backend Developer",
    "AI Developer",
    "PostgreSQL",
    "AWS",
  ],
  locale: "en_IN",
} as const;

export type NavItem = { label: string; href: string; id: string };

/** Homepage sections, in page order. `id` matches the section's DOM id. */
export const navItems: NavItem[] = [
  { label: "About", href: "/#about", id: "about" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "Engineering", href: "/#engineering", id: "engineering" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Achievements", href: "/#achievements", id: "achievements" },
  { label: "Contact", href: "/#contact", id: "contact" },
];
