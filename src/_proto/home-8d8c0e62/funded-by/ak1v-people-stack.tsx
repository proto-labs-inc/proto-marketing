"use client";

import Image from "next/image";
import type { ReactElement } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { useEntranceReady } from "@/components/marketing/partner-page-motion";
import { cn } from "@/lib/utils";

import styles from "./ak1v-people-stack.module.css";

// Portraits that sit slightly higher in the overlapping cluster, matching the
// old prototype's hand-tuned stagger (person2 / person4 of 5 lifted up).
const LIFTED_INDEXES = new Set([1, 3]);

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

  const entered = useEntranceReady();

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          className={cn(styles.root, entered && styles.entered)}
          aria-labelledby="people-stack-heading"
        >
          <div className={styles.heading}>
            <span className={styles.ycMark} aria-hidden="true">
              Y
            </span>
            <span className={styles.headingText}>
              <small>Funding proof</small>
              <strong id="people-stack-heading">
                A small circle with big conviction.
              </strong>
            </span>
          </div>
          <div className={styles.cluster} aria-label="Proto angel investors">
            {BACKERS.map((backer, index) => (
              <a
                aria-label={`${backer.name}, ${backer.role}`}
                className={cn(
                  styles.portrait,
                  LIFTED_INDEXES.has(index) && styles.portraitOffset,
                )}
                href={backer.href}
                key={backer.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.image}>
                  <Image alt="" draggable={false} src={backer.portrait} />
                </span>
                <span className={styles.profile}>
                  <strong>{backer.name}</strong>
                  <small>{backer.role}</small>
                  <span>{backer.detail}</span>
                </span>
              </a>
            ))}
            <span className={styles.count} aria-hidden="true">
              + YC
            </span>
          </div>
          <p className={styles.caption}>
            Five angels, one accelerator, and a shared belief that software
            should start with a picture.
          </p>
        </section>
      </div>
    </div>
  );
}
