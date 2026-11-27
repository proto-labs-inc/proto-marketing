"use client";

import type * as React from "react";

import Image from "next/image";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import { useDraggableBackers } from "./_shared/use-draggable-backers";
import styles from "./sfog-photo-drag.module.css";

const POSITION_CLASSES = [
  styles.person1,
  styles.person2,
  styles.person3,
  styles.person4,
  styles.person5,
  styles.person6,
];

const INSTRUCTION_ID = "sfog-photo-drag-instruction";

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
        <section
          aria-label="Proto angel investors"
          className={styles.root}
          data-proto-id="funded-by-section"
        >
          <span className={styles.instruction} id={INSTRUCTION_ID}>
            Drag a portrait to move it. When focused, use the arrow keys.
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
        </section>
      </div>
    </div>
  );
}
