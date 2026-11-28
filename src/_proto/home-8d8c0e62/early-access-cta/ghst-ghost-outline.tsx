"use client";

import type * as React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";

import { EarlyAccessArrow } from "@/components/marketing/early-access-header";

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
  const style = { "--cta-pink": pink } as CSSProperties;

  return (
    <Link
      href="/early-access"
      style={style}
      className={`group mx-auto mb-[1.15rem] flex w-fit items-center gap-2 border-b-2 border-[var(--cta-pink)]/30 pb-0.5 text-[0.9375rem] font-bold text-[var(--cta-pink)] transition-colors duration-150 hover:border-[var(--cta-pink)] md:mb-8 ${className}`}
      onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          onNavigate();
        }
      }}
    >
      Get early access
      <EarlyAccessArrow />
    </Link>
  );
}
