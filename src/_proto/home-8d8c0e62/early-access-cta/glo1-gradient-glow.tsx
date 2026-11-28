"use client";

import type * as React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getHomeShapePaletteColor } from "@/components/marketing/shape-colors-content";

const gold = getHomeShapePaletteColor("gold", "electric-pop");

type EarlyAccessProps = {
  pink: string;
  onNavigate: () => void;
  className?: string;
};

export default function Variant({
  props,
  scope,
  original,
}: {
  props: EarlyAccessProps;
  scope: unknown;
  original: React.ReactElement;
}) {
  void scope;
  void original;

  const { pink, onNavigate, className = "" } = props;
  const style = {
    "--cta-pink": pink,
    "--cta-gold": `rgb(${gold.join(" ")})`,
  } as CSSProperties;

  return (
    <Link
      href="/early-access"
      style={style}
      className={`group relative mx-auto mb-[1.15rem] flex w-fit items-center gap-2.5 overflow-hidden rounded-[0.875rem] px-5 py-2.5 text-[0.9375rem] font-bold text-white shadow-[0_8px_24px_-8px_var(--cta-pink)] transition-transform duration-200 hover:scale-[1.03] md:mb-8 ${className}`}
      onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          onNavigate();
        }
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,var(--cta-pink),var(--cta-gold),var(--cta-pink))] bg-[length:200%_100%] transition-[background-position] duration-500 group-hover:bg-[position:100%_0]"
      />
      Get early access
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        strokeWidth={2.5}
      />
    </Link>
  );
}
