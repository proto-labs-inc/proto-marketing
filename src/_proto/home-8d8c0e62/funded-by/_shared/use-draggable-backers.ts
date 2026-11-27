"use client";

import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";

type Offset = { x: number; y: number };
type ActiveDrag = { index: number; pointerId: number; x: number; y: number };

const ZERO_OFFSET: Offset = { x: 0, y: 0 };
const KEYBOARD_STEP = 8;

/**
 * Shared drag-to-rearrange interaction for backer portraits/tags, extracted
 * from the production FundedBySection baseline so every "funded by" variant
 * that reuses the drag affordance behaves identically.
 */
export function useDraggableBackers() {
  const [offsets, setOffsets] = useState<Offset[]>(() =>
    BACKERS.map(() => ZERO_OFFSET),
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [topIndex, setTopIndex] = useState<number | null>(null);
  const activeDrag = useRef<ActiveDrag | null>(null);

  function moveBacker(index: number, x: number, y: number) {
    setOffsets((current) =>
      current.map((offset, i) =>
        i === index ? { x: offset.x + x, y: offset.y + y } : offset,
      ),
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
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    moveBacker(drag.index, event.clientX - drag.x, event.clientY - drag.y);
    activeDrag.current = { ...drag, x: event.clientX, y: event.clientY };
  }

  function finishDrag(event: PointerEvent<HTMLAnchorElement>) {
    if (activeDrag.current?.pointerId !== event.pointerId) return;
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

  function dragStyle(index: number): CSSProperties {
    const offset = offsets[index] ?? ZERO_OFFSET;
    return {
      "--drag-x": `${offset.x}px`,
      "--drag-y": `${offset.y}px`,
      zIndex: topIndex === index ? 20 : undefined,
    } as CSSProperties;
  }

  return {
    draggedIndex,
    dragStyle,
    handlePointerDown,
    handlePointerMove,
    finishDrag,
    handleKeyDown,
  };
}
