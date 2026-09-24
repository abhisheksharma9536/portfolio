"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { navItems } from "@/lib/site";
import { profile } from "@/content/profile";
import { openAssistant } from "@/lib/events";
import { applyThemePreference } from "@/lib/theme";
import {
  ArrowRight,
  Copy,
  Download,
  FileText,
  Github,
  Linkedin,
  Monitor,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "@/components/ui/icons";
import { cn } from "@/components/ui/primitives";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Actions" | "Theme";
  icon: ReactNode;
  keywords?: string;
  run: () => void;
};

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    return [
      ...navItems.map((item) => ({
        id: `nav-${item.id}`,
        label: item.label,
        group: "Navigate" as const,
        icon: <ArrowRight size={16} />,
        run: go(item.href),
      })),
      {
        id: "nav-goodiebag",
        label: "GoodieBag case study",
        group: "Navigate",
        icon: <ArrowRight size={16} />,
        keywords: "project marketplace pos webhook architecture",
        run: go("/work/goodiebag"),
      },
      {
        id: "ask",
        label: "Ask Abhishek (assistant)",
        group: "Actions",
        icon: <Sparkles size={16} />,
        keywords: "chat ai question claude",
        run: () => openAssistant(),
      },
      {
        id: "resume-view",
        label: "View resume",
        group: "Actions",
        icon: <FileText size={16} />,
        keywords: "cv pdf",
        run: () => window.open(profile.resume.href, "_blank", "noopener"),
      },
      {
        id: "resume-download",
        label: "Download resume",
        group: "Actions",
        icon: <Download size={16} />,
        keywords: "cv pdf",
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resume.href;
          a.download = profile.resume.downloadName;
          a.click();
        },
      },
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: <Copy size={16} />,
        keywords: `mail contact ${profile.email}`,
        run: () => {
          void navigator.clipboard?.writeText(profile.email).then(() => setToast("Email copied"));
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "Actions",
        icon: <Github size={16} />,
        keywords: "code repositories",
        run: () => window.open(profile.links.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Actions",
        icon: <Linkedin size={16} />,
        run: () => window.open(profile.links.linkedin, "_blank", "noopener"),
      },
      { id: "theme-light", label: "Light theme", group: "Theme", icon: <Sun size={16} />, run: () => applyThemePreference("light") },
      { id: "theme-dark", label: "Dark theme", group: "Theme", icon: <Moon size={16} />, run: () => applyThemePreference("dark") },
      {
        id: "theme-system",
        label: "System theme",
        group: "Theme",
        icon: <Monitor size={16} />,
        keywords: "auto os",
        run: () => applyThemePreference("system"),
      },
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const select = (command: Command | undefined) => {
    if (!command) return;
    const keepOpen = command.id === "copy-email";
    command.run();
    if (!keepOpen) onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(results[activeIndex]);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  let lastGroup = "";

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command menu"
      onClose={() => {
        onClose();
        setQuery("");
        setActiveIndex(0);
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed inset-x-0 top-[12vh] m-0 mx-auto w-[min(36rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg shadow-lifted backdrop:bg-black/35 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={17} className="text-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search sections and actions…"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-label="Search commands"
          className="h-14 flex-1 bg-transparent text-[0.97rem] outline-none placeholder:text-faint focus-visible:outline-none"
        />
        <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-faint">esc</kbd>
      </div>
      <ul id={listId} role="listbox" aria-label="Commands" className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
        {results.length === 0 ? (
          <li className="px-3 py-8 text-center text-sm text-muted" role="presentation">
            No results for “{query}”
          </li>
        ) : null}
        {results.map((command, i) => {
          const header = command.group !== lastGroup ? command.group : null;
          lastGroup = command.group;
          return (
            <li key={command.id} role="presentation">
              {header ? (
                <p role="presentation" className="eyebrow px-3 pb-1.5 pt-3 first:pt-1">
                  {header}
                </p>
              ) : null}
              <div
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseMove={() => setActiveIndex(i)}
                onClick={() => select(command)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[0.93rem]",
                  i === activeIndex ? "bg-accent-soft text-fg" : "text-muted",
                )}
              >
                <span className={cn(i === activeIndex ? "text-accent" : "text-faint")}>{command.icon}</span>
                {command.label}
              </div>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="border-t border-line px-4 py-2.5 text-xs text-faint">
        {toast ?? "↑↓ to navigate · Enter to select"}
      </p>
    </dialog>
  );
}
