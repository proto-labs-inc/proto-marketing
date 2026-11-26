"use client";

import { useEffect } from "react";

/** Browser previews use the same selection runtime that desktop installs. */
export function useHostedFrameTools(): void {
  useEffect(() => {
    if (window.parent === window || !window.name.startsWith("prototype-page:")) return;
    const parent = window.parent as Window & { protoDesktop?: unknown; protoHost?: unknown; protoShell?: unknown };
    try {
      if (parent.location.origin !== window.location.origin) return;
      // Native desktop mounting owns its previews, including same-origin ones.
      if (parent.protoDesktop || parent.protoHost || parent.protoShell) return;
    } catch {
      return;
    }

    const frameOrigin = window.location.origin;
    let generation = 0;
    let unmount: (() => void) | undefined;
    const report = (status: "loading" | "ready" | "unavailable") => {
      parent.postMessage({ type: "frame-tools-status", status, owner: "browser" }, frameOrigin);
    };
    const stop = () => {
      generation += 1;
      unmount?.();
      unmount = undefined;
    };
    const start = async () => {
      const attempt = ++generation;
      report("loading");
      try {
        const runtimeUrl = new URL("/frame-tools/v1.js", frameOrigin).href;
        const { mountFrameTools } = await import(/* webpackIgnore: true */ runtimeUrl) as {
          mountFrameTools: (options: { frameOrigin: string }) => () => void;
        };
        if (attempt !== generation) return;
        unmount = mountFrameTools({ frameOrigin });
        report("ready");
      } catch {
        if (attempt === generation) report("unavailable");
      }
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) void start();
    };
    void start();
    window.addEventListener("pagehide", stop);
    window.addEventListener("pageshow", restore);
    return () => {
      stop();
      window.removeEventListener("pagehide", stop);
      window.removeEventListener("pageshow", restore);
    };
  }, []);
}
