"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { BACKERS } from "./funded-by-content";
import {
  inviteBlockClassName,
  inviteBodyClass,
  inviteBodyLineHighlightClass,
  inviteContentShellClass,
} from "./invite-layout-classes";
import { useEntranceReady } from "./partner-page-motion";
import styles from "./funded-by-section.module.css";

type Offset = {
  x: number;
  y: number;
};

type ActiveDrag = {
  index: number;
  pointerId: number;
  x: number;
  y: number;
};

const POSITION_CLASS_NAMES = [
  styles.person1,
  styles.person2,
  styles.person3,
  styles.person4,
  styles.person5,
  styles.person6,
] as const;

const INITIAL_OFFSETS: Offset[] = BACKERS.map(() => ({ x: 0, y: 0 }));
const ZERO_OFFSET: Offset = { x: 0, y: 0 };
const KEYBOARD_STEP = 8;

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

export function FundedBySection() {
  const reduceMotion = useReducedMotion();
  const ready = useEntranceReady();
  const entered = ready || reduceMotion;
  const [offsets, setOffsets] = useState(INITIAL_OFFSETS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [topIndex, setTopIndex] = useState<number | null>(null);
  const activeDrag = useRef<ActiveDrag | null>(null);
  const instructionId = "funded-by-drag-instruction";

  function moveBacker(index: number, x: number, y: number) {
    setOffsets((current) =>
      BACKERS.map((_, offsetIndex) => {
        const offset = current[offsetIndex] ?? ZERO_OFFSET;

        if (offsetIndex !== index) {
          return offset;
        }

        return { x: offset.x + x, y: offset.y + y };
      }),
    );
  }

  function handlePointerDown(
    event: PointerEvent<HTMLAnchorElement>,
    index: number,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);
    activeDrag.current = {
      index,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    setDraggedIndex(index);
    setTopIndex(index);
  }

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    moveBacker(drag.index, event.clientX - drag.x, event.clientY - drag.y);
    activeDrag.current = {
      ...drag,
      x: event.clientX,
      y: event.clientY,
    };
  }

  function finishDrag(event: PointerEvent<HTMLAnchorElement>) {
    if (activeDrag.current?.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeDrag.current = null;
    setDraggedIndex(null);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    let x = 0;
    let y = 0;

    switch (event.key) {
      case "ArrowLeft":
        x = -KEYBOARD_STEP;
        break;
      case "ArrowRight":
        x = KEYBOARD_STEP;
        break;
      case "ArrowUp":
        y = -KEYBOARD_STEP;
        break;
      case "ArrowDown":
        y = KEYBOARD_STEP;
        break;
      default:
        return;
    }

    event.preventDefault();
    setTopIndex(index);
    moveBacker(index, x, y);
  }

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-prototype-component="funded-by-section"
      >
        <section
          className={cn(styles.root, entered && styles.entered)}
          aria-label="Proto funding backers"
        >
          <p className={cn(inviteBodyClass, styles.title)}>
            <span className={inviteBodyLineHighlightClass}>
              <span className={styles.titleText}>Backed by </span>
              <YCombinatorMark />
              <span className={styles.titleText}> and design &amp;</span>
              <br className={styles.mobileTitleBreak} />
              <span className={styles.titleText}> product legends like:</span>
            </span>
          </p>
          <div className={styles.field}>
            <span className={styles.instruction} id={instructionId}>
              Click and drag a portrait to move it. When focused, use the arrow
              keys.
            </span>
            {BACKERS.map((backer, index) => {
              const offset = offsets[index] ?? ZERO_OFFSET;
              const style = {
                "--drag-x": `${offset.x}px`,
                "--drag-y": `${offset.y}px`,
                zIndex: topIndex === index ? 20 : undefined,
              } as CSSProperties;

              return (
                <a
                  aria-describedby={instructionId}
                  aria-label={`${backer.name}, ${backer.role}`}
                  className={cn(styles.person, POSITION_CLASS_NAMES[index])}
                  data-dragging={draggedIndex === index ? "true" : undefined}
                  href={backer.href}
                  key={backer.name}
                  onClick={() => setTopIndex(index)}
                  onFocus={() => setTopIndex(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onLostPointerCapture={() => {
                    activeDrag.current = null;
                    setDraggedIndex(null);
                  }}
                  onPointerCancel={finishDrag}
                  onPointerDown={(event) => handlePointerDown(event, index)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishDrag}
                  rel="noopener noreferrer"
                  style={style}
                  target="_blank"
                >
                  <span className={styles.frame}>
                    <Image
                      alt=""
                      draggable={false}
                      placeholder="blur"
                      sizes="48px"
                      src={backer.portrait}
                    />
                  </span>
                  <span className={styles.profile}>
                    <strong>{backer.name}</strong>
                    <small>{backer.role}</small>
                    <span>{backer.detail}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
