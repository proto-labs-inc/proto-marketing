"use client";

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
      className={`${styles.back} ${className ?? ""}`}
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
  onNavigate,
  backClassName,
  backHidden,
}: {
  onNavigate: () => void;
  backClassName: string;
  backHidden: boolean;
}) {
  return (
    <main className={styles.page} style={accentStyle}>
      <div className={`${styles.content} ${marketingContentShellClass}`} data-access-backdrop>
        <EarlyAccessBack onNavigate={onNavigate} className={backClassName} hidden={backHidden} />
        <div className={styles.backSpace} aria-hidden="true" />

        <div className={styles.layoutBody}>
          <div className={styles.intro}>
            <h1 className={styles.visuallyHidden}>Early access</h1>
            <p className={styles.lede}>
              <span className={inviteBodyLineHighlightClass}>
                We&apos;ll reach out if we think you&apos;ll be a good fit for our early access pilot.
                {" "}<span className={styles.applicationNote}>If you&apos;ve already applied, use the same email and it&apos;ll be linked to your original application.</span>
              </span>
            </p>
          </div>

          <div className={styles.formPanel}>
            <EarlyAccessForm />
          </div>
        </div>
      </div>
    </main>
  );
}
