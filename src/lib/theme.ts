export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "themechange";

function systemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getThemePreference(): ThemePreference {
  const pref = document.documentElement.dataset.themePref;
  return pref === "light" || pref === "dark" ? pref : "system";
}

export function applyThemePreference(pref: ThemePreference) {
  const root = document.documentElement;
  root.dataset.themePref = pref;
  root.dataset.theme = pref === "system" ? systemTheme() : pref;
  try {
    if (pref === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // Storage can be unavailable (private mode, blocked site data) — the
    // choice still applies for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Subscribe to preference changes and to OS changes while on "system". */
export function subscribeTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getThemePreference() === "system") {
      document.documentElement.dataset.theme = systemTheme();
      callback();
    }
  };
  window.addEventListener(CHANGE_EVENT, callback);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    media.removeEventListener("change", onSystemChange);
  };
}

export const themeLabels: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function nextThemePreference(pref: ThemePreference): ThemePreference {
  return pref === "system" ? "light" : pref === "light" ? "dark" : "system";
}
