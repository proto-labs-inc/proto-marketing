"use client";

import { useEffect, useState, type RefObject } from "react";

import { DRAG_ATTRIBUTION_TOOLTIP_LAYERED_CLASS } from "./springs-drag-attribution-tooltip";

type DragAttributionTooltipLayerProps = {
  tooltipRef: RefObject<HTMLDivElement | null>;
  labelRef: RefObject<HTMLSpanElement | null>;
};

/** Rendered in place below the copy overlays so their text highlights can mask it. */
export function DragAttributionTooltipLayer({
  tooltipRef,
  labelRef,
}: DragAttributionTooltipLayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={tooltipRef}
      className={DRAG_ATTRIBUTION_TOOLTIP_LAYERED_CLASS}
      style={{ display: "none" }}
      aria-hidden
    >
      <span ref={labelRef} />
    </div>
  );
}
