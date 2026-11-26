"use client";

import { useCallback, useEffect, useState } from "react";
import { isEarlyAccessState, type EarlyAccessState } from "@/lib/early-access-states";
import { useHostedFrameTools } from "@/lib/use-hosted-frame-tools";

/** Development previews may be embedded by the production desktop Frame. */
function previewFrameOrigin(): string | null {
  if (process.env.NODE_ENV === "development") {
    if (window.parent === window) return window.location.origin;
    const ancestor = window.location.ancestorOrigins?.[0];
    if (ancestor) return ancestor;
    if (document.referrer) return new URL(document.referrer).origin;
  }
  if (window.parent === window || !window.name.startsWith("prototype-page:")) return null;
  try {
    if (window.parent.location.origin === window.location.origin) return window.location.origin;
  } catch {
    // A production form only accepts a same-origin Frame.
  }
  return null;
}

export function useEarlyAccessPreviewState(): { state: EarlyAccessState | null; clear: () => void } {
  useHostedFrameTools();
  const [state, setState] = useState<EarlyAccessState | null>(null);
  const clear = useCallback(() => setState(null), []);

  useEffect(() => {
    const frameOrigin = previewFrameOrigin();
    if (!frameOrigin) return;
    const sync = () => {
      const requested = new URLSearchParams(window.location.search).get("state");
      setState(isEarlyAccessState(requested) ? requested : null);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== frameOrigin || event.data?.type !== "proto:early-access:set-state") return;
      const requested = event.data.state;
      if (!isEarlyAccessState(requested)) return;
      const url = new URL(window.location.href);
      url.searchParams.set("state", requested);
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
      setState(requested);
    };

    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("message", onMessage);
    // The Frame may have sent its initial state before React attached this listener.
    if (window.parent !== window) window.parent.postMessage({ type: "proto:early-access:ready" }, frameOrigin);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return { state, clear };
}
