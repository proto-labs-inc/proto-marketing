"use client";

import type { ReactElement } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./oig8-quiet-line.module.css";

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
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          className={styles.root}
          aria-labelledby="funded-endorsement-heading"
        >
          <div className={styles.mark} aria-hidden="true">
            Y
          </div>
          <div className={styles.copy}>
            <h2 id="funded-endorsement-heading">Funded by Y Combinator</h2>
            <p>
              Alongside{" "}
              {BACKERS.map((backer, index) => (
                <span key={backer.name}>
                  {index > 0 && ", "}
                  <a href={backer.href} rel="noopener noreferrer" target="_blank">
                    {backer.name}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
