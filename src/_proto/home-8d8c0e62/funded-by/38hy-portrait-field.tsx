"use client";

import Image from "next/image";
import type { ReactElement } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import { useDraggableBackers } from "./_shared/use-draggable-backers";
import styles from "./38hy-portrait-field.module.css";

const POSITION_CLASS_NAMES = [
  styles.person1,
  styles.person2,
  styles.person3,
  styles.person4,
  styles.person5,
  styles.person6,
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

  const {
    draggedIndex,
    dragStyle,
    handlePointerDown,
    handlePointerMove,
    finishDrag,
    handleKeyDown,
  } = useDraggableBackers();
  const instructionId = "portrait-field-drag-instruction";

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          className={styles.root}
          aria-labelledby="portrait-field-heading"
        >
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Funded by Y Combinator</span>
            <h2 className={styles.heading} id="portrait-field-heading">
              Believed in by people who build.
            </h2>
            <p className={styles.body}>
              Meet the backers behind Proto. Drag a portrait to rearrange
              them, or hover to learn why they&apos;re in.
            </p>
          </div>
          <span className={styles.instruction} id={instructionId}>
            Click and drag a portrait to move it. When focused, use the arrow
            keys.
          </span>
          <div className={styles.people} aria-label="Proto angel investors">
            {BACKERS.map((backer, index) => (
              <a
                aria-describedby={instructionId}
                aria-label={`${backer.name}, ${backer.role}`}
                className={cn(styles.person, POSITION_CLASS_NAMES[index])}
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
