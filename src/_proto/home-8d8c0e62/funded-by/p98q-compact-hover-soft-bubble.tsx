"use client";

import type * as React from "react";

import Image from "next/image";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteBodyClass,
  inviteBodyLineHighlightClass,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import { useDraggableBackers } from "./_shared/use-draggable-backers";
import styles from "./p98q-compact-hover-soft-bubble.module.css";

const POSITION_CLASSES = [
  styles.person1,
  styles.person2,
  styles.person3,
  styles.person4,
  styles.person5,
  styles.person6,
];

const INSTRUCTION_ID = "p98q-soft-bubble-drag-instruction";

function YCombinatorMark() {
  return (
    <span className={styles.ycMark} aria-label="Y Combinator" role="img">
      <svg aria-hidden="true" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="#fb651e" />
        <path
          d="M119.374 144.746 75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883.53.994.994 2.021 1.392 3.082.265.398.464.762.597 1.094.132.331.265.63.397.895.663 1.325 1.26 2.618 1.789 3.877.53 1.259.994 2.419 1.392 3.479 1.06-2.254 2.22-4.672 3.479-7.257 1.26-2.585 2.552-5.269 3.878-8.053l26.245-52.092h18.689l-44.338 83.308v53.087h-16.9v-54.081Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

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

  const {
    draggedIndex,
    dragStyle,
    handlePointerDown,
    handlePointerMove,
    finishDrag,
    handleKeyDown,
  } = useDraggableBackers();

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section className={styles.root} aria-label="Proto funding backers">
          <p className={cn(inviteBodyClass, styles.title)}>
            <span className={inviteBodyLineHighlightClass}>
              Backed by <YCombinatorMark /> and design legends like:
            </span>
          </p>
          <div className={styles.field}>
            <span className={styles.instruction} id={INSTRUCTION_ID}>
              Click and drag a portrait to move it. When focused, use the
              arrow keys.
            </span>
            {BACKERS.map((backer, index) => (
              <a
                aria-describedby={INSTRUCTION_ID}
                aria-label={`${backer.name}, ${backer.role}`}
                className={cn(styles.person, POSITION_CLASSES[index])}
                data-dragging={draggedIndex === index ? "true" : undefined}
                href={backer.href}
                key={backer.name}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPointerCancel={finishDrag}
                onPointerDown={(event) => handlePointerDown(event, index)}
                onPointerMove={handlePointerMove}
                onPointerUp={finishDrag}
                rel="noopener noreferrer"
                style={dragStyle(index)}
                target="_blank"
              >
                <span className={styles.frame}>
                  <Image alt="" draggable={false} src={backer.portrait} />
                </span>
                <span className={styles.profile}>
                  <strong>{backer.name}</strong>
                  <small>{backer.role}</small>
                  <span>{backer.detail}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
