"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { navItems } from "@/lib/site";
import { profile } from "@/content/profile";
import { openCommandPalette } from "@/lib/events";
import { ThemeToggle } from "./theme-toggle";
import { Close, Menu, Search } from "@/components/ui/icons";
import { cn } from "@/components/ui/primitives";

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

const noopSubscribe = () => () => {};

/** Platform detection only affects the keyboard hint label (⌘K vs Ctrl K). */
export function useIsMac() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/i.test(navigator.userAgent),
    () => true,
  );
}

/** Tracks which homepage section is in view to highlight its nav link. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrolled();
  const active = useActiveSection(isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const isMac = useIsMac();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const primaryNav = navItems.filter((item) => item.id !== "contact");

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border pl-2 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          scrolled || menuOpen
            ? "border-line bg-bg/75 shadow-soft backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
          aria-label={`${profile.name} — home`}
          onClick={() => setMenuOpen(false)}
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-full bg-fg font-mono text-[0.68rem] font-semibold tracking-tight text-bg transition-colors group-hover:bg-accent group-hover:text-accent-fg"
          >
            AS
          </span>
          <span className="text-[0.94rem] font-semibold tracking-tight">
            {profile.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-[0.84rem] transition-colors",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-subtle"
                      />
                    ) : null}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 text-[0.8rem] text-muted transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
            aria-label="Open command menu"
            aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
          >
            <Search size={15} />
            <span className="hidden xl:inline">Search</span>
            <kbd className="font-mono text-[0.7rem] text-faint">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <button
            type="button"
            onClick={openCommandPalette}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-fg sm:hidden"
            aria-label="Open command menu"
          >
            <Search size={17} />
          </button>
          <ThemeToggle />
          <Link
            href="/#contact"
            className="ml-1 hidden h-9 items-center rounded-full bg-fg px-4 text-[0.84rem] font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg sm:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full text-fg hover:bg-subtle lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <Close size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!menuOpen}
        className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl border border-line bg-bg/95 p-2 shadow-lifted backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="grid">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[1.05rem] font-medium tracking-tight hover:bg-subtle"
                >
                  {item.label}
                  <span className="font-mono text-xs text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
