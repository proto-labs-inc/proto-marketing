import type { CSSProperties } from "react";
import Link from "next/link";
import { getHomeShapePaletteColor } from "./shape-colors-content";

import styles from "./early-access-header.module.css";

const gold = getHomeShapePaletteColor("gold", "electric-pop");

export function EarlyAccessArrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.arrow}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        transform={direction === "left" ? "rotate(180 12 12)" : undefined}
      />
    </svg>
  );
}

export function EarlyAccessHeader({ pink, onNavigate, className = "" }: { pink: string; onNavigate: () => void; className?: string }) {
  const style = {
    "--early-access-pink": pink,
    "--early-access-gold": `rgb(${gold.join(" ")})`,
  } as CSSProperties;

  return (
    <Link
      className={`${styles.button} ${styles.headerButton} ${className}`}
      href="/early-access"
      style={style}
      onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          onNavigate();
        }
      }}
    >
      <span>Get early access</span>
      <EarlyAccessArrow />
    </Link>
  );
}
