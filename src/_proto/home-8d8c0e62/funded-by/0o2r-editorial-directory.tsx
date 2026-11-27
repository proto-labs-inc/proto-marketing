"use client";

import type { ReactElement } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import { cn } from "@/lib/utils";

import styles from "./0o2r-editorial-directory.module.css";

const SUPPORTER_CLASS_NAMES = [
  styles.supporter1,
  styles.supporter2,
  styles.supporter3,
  styles.supporter4,
  styles.supporter5,
  styles.supporter6,
] as const;

export default function Variant({
  props,
  scope,
  original,
}: {
  props: Record<string, unknown>;
  scope: unknown;
  original: ReactElement;
}) {
  void props;
  void scope;
  void original;

  return (
    <div className={styles.layout} data-proto-id="funded-by-section">
      <section
        className={styles.root}
        aria-label="Funded by Y Combinator and angel investors"
      >
        <div className={styles.field}>
          {BACKERS.map((backer, index) => (
            <a
              className={cn(styles.supporter, SUPPORTER_CLASS_NAMES[index])}
              href={backer.href}
              key={backer.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span aria-hidden="true" />
              <span>
                <strong>{backer.name}</strong>
                <small>{backer.role}</small>
              </span>
            </a>
          ))}
          <div className={styles.core}>
            <span className={styles.ycMark} aria-hidden="true">
              Y
            </span>
            <span>
              <small>Funded by</small>
              Y Combinator
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
