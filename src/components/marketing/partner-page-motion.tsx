"use client";

import { useLayoutEffect, useState } from "react";

export const partnerEaseOut = [0.22, 1, 0.36, 1] as const;

// NOTE: Entrance transforms are written as full `transform` strings (not the
// `x`/`y`/`scale` shorthands) so Motion runs them via the compositor (WAAPI)
// instead of the main-thread JS frameloop. Mobile browsers throttle rAF (e.g.
// iOS Low Power Mode) which desyncs shorthand-driven delays and scrambles the
// staggered entrance order; WAAPI transforms stay correctly timed.
export const partnerFadeUpHidden = { opacity: 0, transform: "translateY(18px)" };
export const partnerFadeUpVisible = { opacity: 1, transform: "translateY(0px)" };

export const partnerPopSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 26,
};

export const PARTNER_FADE_UP_DURATION = 0.55;

/** Brief beat after the copy lands before the canvas shapes appear. */
export const PARTNER_SHAPE_REVEAL_DELAY_EXTRA = 0.14;

/**
 * Returns false until the browser has committed its first paint, then true.
 *
 * Motion drives entrance transforms via WAAPI (compositor). Chromium advances
 * a WAAPI animation's timeline from creation in wall-clock time, so an entrance
 * created before the first paint (e.g. a cold production hard-load, where the
 * bundle eval + initial render land in one pre-paint burst) has already elapsed
 * by the time the page paints — the animation appears skipped. Gating `animate`
 * on this flag defers the entrance until after paint so it always plays.
 */
export function useEntranceReady(): boolean {
  const [ready, setReady] = useState(false);

  // Defer until after the first paint so Motion mounts its WAAPI entrance on a
  // fresh element instead of toggling `animate` on a node that already existed
  // during SSR/hydration (Chromium prod skips that).
  useLayoutEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  return ready;
}
