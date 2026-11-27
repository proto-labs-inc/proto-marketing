"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import {
  applyResolvedTheme,
  isThemePreference,
  DEFAULT_THEME_PREFERENCE,
  persistThemePreference,
  readStoredThemePreference,
  readThemePreview,
  resolveTheme,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/marketing/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * The element the marketing surface lives in. It carries the `marketing`
 * class that scopes marketing.css, the data-theme attribute the themes key
 * on, and the font variables, and it provides the theme to its subtree.
 * The bootstrap script sets the stored theme before first paint; hydration
 * then sees the attribute it wrote, hence suppressHydrationWarning.
 */
export function MarketingRoot({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [preference, setPreferenceState] = useState<ThemePreference>(
    DEFAULT_THEME_PREFERENCE,
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [ready, setReady] = useState(false);

  const apply = useCallback((next: ThemePreference) => {
    const resolved = resolveTheme(next);
    if (rootRef.current) applyResolvedTheme(rootRef.current, resolved);
    setResolvedTheme(resolved);
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      const next = readThemePreview() ?? readStoredThemePreference();
      setPreferenceState(next);
      apply(next);
    };
    syncFromLocation();
    setReady(true);
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [apply]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const sync = () => {
      const requested = new URLSearchParams(window.location.search).get("theme");
      let next = readStoredThemePreference();
      if (isThemePreference(requested)) next = requested;
      setPreferenceState(next);
      apply(next);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [apply]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      if (readThemePreview() !== null) {
        const url = new URL(window.location.href);
        url.searchParams.set("state", next);
        window.history.replaceState(window.history.state, "", url);
        window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
        return;
      }
      setPreferenceState(next);
      persistThemePreference(next);
      apply(next);
    },
    [apply],
  );

  useEffect(() => {
    if (!ready || preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => apply("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [apply, preference, ready]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = readThemePreview() ?? readStoredThemePreference();
      setPreferenceState(next);
      apply(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return (
    <div
      ref={rootRef}
      className={cn("marketing", className)}
      data-theme="dark"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </div>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within MarketingRoot");
  }
  return context;
}
