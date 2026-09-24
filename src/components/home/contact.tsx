import { profile } from "@/content/profile";
import { ExternalLink, Section } from "@/components/ui/primitives";
import { ArrowUpRight, Download, FileText, Github, Linkedin, Mail, MapPin, Phone } from "@/components/ui/icons";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";

const rowClass =
  "group flex items-center gap-4 rounded-xl px-3 py-3 -mx-3 transition-colors hover:bg-subtle/70";

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted group-hover:text-accent">
      {children}
    </span>
  );
}

export function Contact() {
  return (
    <Section
      id="contact"
      index="07"
      eyebrow="Contact"
      title={
        <>
          Have something that needs to{" "}
          <span className="serif-accent text-accent">ship?</span> Let&apos;s talk.
        </>
      }
      intro={
        <p>
          Roles, projects or a question about my work — send a message and it lands
          directly in my inbox.
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="reveal lg:col-span-5">
          <ul className="grid grid-cols-1 gap-1">
            <li className="flex items-center gap-2">
              <a href={`mailto:${profile.email}`} className={`${rowClass} min-w-0 flex-1`}>
                <IconBubble>
                  <Mail size={17} />
                </IconBubble>
                <span className="min-w-0">
                  <span className="eyebrow block">Email</span>
                  <span className="block truncate text-[0.97rem] font-medium">{profile.email}</span>
                </span>
              </a>
              <CopyEmail email={profile.email} />
            </li>
            <li>
              <a href={profile.phone.href} className={rowClass}>
                <IconBubble>
                  <Phone size={17} />
                </IconBubble>
                <span>
                  <span className="eyebrow block">Phone</span>
                  <span className="block text-[0.97rem] font-medium">{profile.phone.display}</span>
                </span>
              </a>
            </li>
            <li>
              <ExternalLink href={profile.links.linkedin} className={rowClass}>
                <IconBubble>
                  <Linkedin size={16} />
                </IconBubble>
                <span className="flex-1">
                  <span className="eyebrow block">LinkedIn</span>
                  <span className="block text-[0.97rem] font-medium">{profile.name}</span>
                </span>
                <ArrowUpRight size={16} className="text-faint group-hover:text-fg" />
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.links.github} className={rowClass}>
                <IconBubble>
                  <Github size={16} />
                </IconBubble>
                <span className="flex-1">
                  <span className="eyebrow block">GitHub</span>
                  <span className="block text-[0.97rem] font-medium">@{profile.links.githubUsername}</span>
                </span>
                <ArrowUpRight size={16} className="text-faint group-hover:text-fg" />
              </ExternalLink>
            </li>
            <li className="flex items-center gap-4 px-0 py-3">
              <IconBubble>
                <MapPin size={17} />
              </IconBubble>
              <span>
                <span className="eyebrow block">Location</span>
                <span className="block text-[0.97rem] font-medium">{profile.location.display}</span>
              </span>
            </li>
          </ul>

          <div className="mt-8 rounded-2xl border border-line p-5">
            <p className="flex items-center gap-2 text-[0.95rem] font-medium">
              <FileText size={17} className="text-accent" />
              Resume
            </p>
            <p className="mt-1 text-sm text-muted">Two pages · PDF</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ExternalLink
                href={profile.resume.href}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium hover:border-fg/30"
              >
                View Resume
              </ExternalLink>
              <a
                href={profile.resume.href}
                download={profile.resume.downloadName}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg hover:bg-accent hover:text-accent-fg"
              >
                <Download size={15} />
                Download Resume
              </a>
            </div>
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <div className="card relative rounded-[1.4rem] p-6 shadow-soft sm:p-9">
            <ContactForm />
            <noscript>
              <p className="mt-4 text-sm text-muted">
                The form needs JavaScript. You can email me at{" "}
                <a href={`mailto:${profile.email}`} className="underline">
                  {profile.email}
                </a>
                .
              </p>
            </noscript>
          </div>
        </div>
      </div>
    </Section>
  );
}
