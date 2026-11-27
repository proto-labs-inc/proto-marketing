"use client";

import { useEffect, useState } from "react";

export type HomePagePreviewState = "home" | "form" | "submitted";

function isHomePagePreviewState(value: string | null): value is HomePagePreviewState {
  return value === "home" || value === "form" || value === "submitted";
}

/** Reads ?state= on mount and on popstate, without reloading or remounting. */
export function useHomePagePreviewState(): HomePagePreviewState | null {
  const [state, setState] = useState<HomePagePreviewState | null>(null);

  useEffect(() => {
    const sync = () => {
      const requested = new URLSearchParams(window.location.search).get("state");
      setState(isHomePagePreviewState(requested) ? requested : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return state;
}
