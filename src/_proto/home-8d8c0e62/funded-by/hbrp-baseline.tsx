"use client";

import type * as React from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./hbrp-baseline.module.css";

export default function Variant({
  props,
  scope,
  original,
}: {
  props: Record<string, unknown>;
  scope: unknown;
  original: React.ReactElement;
}) {
  void props;
  void scope;
  void original;

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          aria-labelledby="funded-by-heading"
          className={styles.root}
          data-proto-id="funded-by-section"
        >
          <div className={styles.row}>
            <span className={styles.label} id="funded-by-heading">
              Funded by
            </span>
            <span className={styles.ycLockup}>
              <span aria-hidden="true" className={styles.ycMark}>
                Y
              </span>
              <span>Combinator</span>
            </span>
          </div>
          <div className={cn(styles.row, styles.investors)}>
            <span className={styles.label}>Alongside</span>
            <span className={styles.investorList}>
              {BACKERS.map((backer, index) => (
                <span key={backer.name}>
                  {index > 0 && ", "}
                  <a href={backer.href} rel="noopener noreferrer" target="_blank">
                    {backer.name}
                  </a>
                </span>
              ))}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
