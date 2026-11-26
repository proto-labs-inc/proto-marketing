/**
 * The marketing surface's colour themes. The chosen theme lives as the
 * data-theme attribute of the marketing root (the element MarketingRoot
 * renders), never on <html>, which belongs to the app's own light/dark mode.
 */
export const THEME_STORAGE_KEY = "proto-color-mode";

export const THEME_PREFERENCES = [
  "light",
  "dark",
  "matrix",
  "p5js",
  "macintosh",
  "system",
] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme =
  | "light"
  | "dark"
  | "matrix"
  | "p5js"
  | "macintosh";

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    value === "light" ||
    value === "dark" ||
    value === "matrix" ||
    value === "p5js" ||
    value === "macintosh" ||
    value === "system"
  );
}

export function toColorScheme(resolved: ResolvedTheme): "light" | "dark" {
  return resolved === "light" ||
    resolved === "p5js" ||
    resolved === "macintosh"
    ? "light"
    : "dark";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

export function readStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_THEME_PREFERENCE;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

export function persistThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Private mode and blocked storage should not break theming.
  }
}

export function applyResolvedTheme(root: HTMLElement, resolved: ResolvedTheme) {
  root.dataset.theme = resolved;
  root.style.colorScheme = toColorScheme(resolved);
}

/**
 * Runs inline as the marketing root's first child, before the page paints, so
 * a stored theme shows from the first frame instead of after hydration. The
 * root is the script's parent element.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){var e=document.currentScript.parentElement;try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var p=s==="light"||s==="dark"||s==="matrix"||s==="p5js"||s==="macintosh"||s==="system"?s:${JSON.stringify(DEFAULT_THEME_PREFERENCE)};var r=p==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):p;e.dataset.theme=r;e.style.colorScheme=r==="light"||r==="p5js"||r==="macintosh"?"light":"dark"}catch(err){e.dataset.theme="dark";e.style.colorScheme="dark"}})()`;
