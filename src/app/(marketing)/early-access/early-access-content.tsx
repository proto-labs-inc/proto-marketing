"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { HomeButton } from "@/components/marketing/home-button";
import { inviteBodyLineHighlightClass, marketingContentShellClass } from "@/components/marketing/invite-layout-classes";
import { getHomeShapePaletteColor } from "@/components/marketing/shape-colors-content";

import { EarlyAccessForm } from "./early-access-form";
import styles from "./page.module.css";

const pink = getHomeShapePaletteColor("pink", "electric-pop", {
  value: 1.1,
  saturation: 1.19,
});
const gold = getHomeShapePaletteColor("gold", "electric-pop");
const accentStyle = {
  "--early-access-accent": `rgb(${pink.join(" ")})`,
  "--early-access-note-gold": `rgb(${gold.join(" ")})`,
} as CSSProperties;

export function EarlyAccessBack({
  onNavigate,
  className,
  hidden,
}: {
  onNavigate: () => void;
  className?: string;
  hidden?: boolean;
}) {
  return (
    <HomeButton
      className={className}
      href="/"
      aria-hidden={hidden}
      inert={hidden}
      onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          onNavigate();
        }
      }}
    />
  );
}

export function EarlyAccessContent({
  active,
  onNavigate,
  backClassName,
  backHidden,
  forcedStatus,
}: {
  active: boolean;
  onNavigate: () => void;
  backClassName: string;
  backHidden: boolean;
  forcedStatus?: "success";
}) {
  const [countState, setCountState] = useState<
    { status: "loading" | "error" } | { status: "ready"; count: number }
  >({ status: "loading" });
  const [countRevision, setCountRevision] = useState(0);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();

    async function loadCount() {
      try {
        const response = await fetch("/api/early-access", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Waitlist count unavailable");
        const result: { count: unknown } = await response.json();
        if (typeof result.count !== "number" || !Number.isSafeInteger(result.count) || result.count < 0) {
          throw new Error("Invalid waitlist count");
        }
        setCountState({ status: "ready", count: result.count });
      } catch {
        if (!controller.signal.aborted) setCountState({ status: "error" });
      }
    }

    void loadCount();
    return () => controller.abort();
  }, [active, countRevision]);

  return (
    <main className={styles.page} style={accentStyle}>
      <EarlyAccessBack onNavigate={onNavigate} className={backClassName} hidden={backHidden} />
      <div className={`${styles.content} ${marketingContentShellClass}`} data-access-backdrop>
        <div className={styles.backSpace} aria-hidden="true" />

        <div className={styles.layoutBody}>
          <div className={styles.intro}>
            <h1 className={styles.visuallyHidden}>Early access</h1>
            <p className={styles.lede}>
              <span className={inviteBodyLineHighlightClass}>
                <strong>Proto</strong> is currently piloting a limited number of select users.
                We&apos;ll reach out if we think you might be a fit, or when we open up access.
              </span>
            </p>
          </div>

          <div className={styles.formPanel}>
            <EarlyAccessForm
              waitlistCount={countState.status === "ready" ? countState.count : null}
              onSubmitted={() => {
                setCountState({ status: "loading" });
                setCountRevision((revision) => revision + 1);
              }}
              forcedStatus={forcedStatus}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
