import Link from "next/link";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";
import { ExternalLink } from "@/components/ui/primitives";
import { Github, Linkedin, Mail } from "@/components/ui/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
          <p className="prose-muted mt-2 max-w-sm text-sm">
            {profile.title} · {profile.location.city}, {profile.location.country}.
            Building production web, mobile, backend and AI systems.
          </p>
          <div className="mt-5 flex gap-2">
            <ExternalLink
              href={profile.links.github}
              className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
              aria-label="GitHub"
            >
              <Github size={16} />
            </ExternalLink>
            <ExternalLink
              href={profile.links.linkedin}
              className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </ExternalLink>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
              aria-label={`Email ${profile.email}`}
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <p className="eyebrow mb-4">Sections</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="text-muted hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/work/goodiebag" className="text-muted hover:text-fg">
                GoodieBag case study
              </Link>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow mb-4">Resume</p>
          <ul className="grid gap-2 text-sm">
            <li>
              <ExternalLink href={profile.resume.href} className="text-muted hover:text-fg">
                View resume (PDF)
              </ExternalLink>
            </li>
            <li>
              <a
                href={profile.resume.href}
                download={profile.resume.downloadName}
                className="text-muted hover:text-fg"
              >
                Download resume
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <p>Built with Next.js, TypeScript and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
