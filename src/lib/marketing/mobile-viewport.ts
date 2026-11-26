/**
 * The marketing page's mobile breakpoint, as a store for useSyncExternalStore:
 * below Tailwind's sm the shapes spawn smaller and the copy sits higher.
 */
const MOBILE_MAX_WIDTH_QUERY = "(max-width: 639px)";

export function getIsMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches;
}

export function subscribeToMobileViewport(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_MAX_WIDTH_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}
