import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for assistant replies: paragraphs,
 * "-"/"*" and numbered lists, **bold**, `code` and [links](url). It builds
 * React elements (never raw HTML), and only allows site-relative, https and
 * mailto links — so model output can't inject markup or javascript: URLs.
 */

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function safeHref(href: string): string | null {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("#")) return href;
  if (/^https:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
  return null;
}

function renderInline(text: string, onNavigate?: () => void): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const href = safeHref(link[2]);
      if (!href) return link[1];
      const className = "font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";
      if (href.endsWith(".pdf")) {
        // Static files (already base-path aware) open directly, not via client routing.
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {link[1]}
          </a>
        );
      }
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link key={i} href={href} className={className} onClick={onNavigate}>
            {link[1]}
          </Link>
        );
      }
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  for (const rawLine of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const last = blocks[blocks.length - 1];
    if (!line.trim()) {
      blocks.push({ type: "p", lines: [] });
    } else if (bullet) {
      if (last?.type === "ul") last.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
    } else if (numbered) {
      if (last?.type === "ol") last.items.push(numbered[1]);
      else blocks.push({ type: "ol", items: [numbered[1]] });
    } else {
      // Strip stray heading markers; replies are meant to be headless.
      const text = line.replace(/^#{1,6}\s+/, "");
      if (last?.type === "p") last.lines.push(text);
      else blocks.push({ type: "p", lines: [text] });
    }
  }
  return blocks.filter((b) => (b.type === "p" ? b.lines.length > 0 : b.items.length > 0));
}

export function Markdown({ source, onNavigate }: { source: string; onNavigate?: () => void }) {
  return (
    <div className="grid gap-3">
      {parseBlocks(source).map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i} className="grid gap-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.62rem] size-1 shrink-0 rounded-full bg-accent" />
                  <span>{renderInline(item, onNavigate)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i} className="grid list-decimal gap-1.5 pl-5 marker:text-faint">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, onNavigate)}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{renderInline(block.lines.join(" "), onNavigate)}</p>;
      })}
    </div>
  );
}
