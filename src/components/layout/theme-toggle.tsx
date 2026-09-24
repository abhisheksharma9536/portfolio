"use client";

import { useSyncExternalStore } from "react";
import {
  applyThemePreference,
  getThemePreference,
  nextThemePreference,
  subscribeTheme,
  themeLabels,
  type ThemePreference,
} from "@/lib/theme";
import { Monitor, Moon, Sun } from "@/components/ui/icons";

const icons: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function useThemePreference() {
  return useSyncExternalStore(
    subscribeTheme,
    getThemePreference,
    () => "system" as const,
  );
}

export function ThemeToggle() {
  const pref = useThemePreference();
  const next = nextThemePreference(pref);
  const Icon = icons[pref];

  return (
    <button
      type="button"
      onClick={() => applyThemePreference(next)}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
      aria-label={`Theme: ${themeLabels[pref]}. Switch to ${themeLabels[next]}`}
      title={`Theme: ${themeLabels[pref]}`}
    >
      <Icon size={17} />
    </button>
  );
}
