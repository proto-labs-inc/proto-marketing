"use client";

import type * as React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      className={`mx-auto mb-[1.15rem] flex w-fit items-center gap-2.5 rounded-[0.875rem] border-2 border-[var(--cta-pink)] bg-transparent px-5 py-2.5 text-[0.9375rem] font-bold text-[var(--cta-pink)] transition-colors duration-150 hover:bg-[var(--cta-pink)]/10 md:mb-8 ${className}`}
      onClick={(event) => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          onNavigate();
        }
      }}
    >
      Get early access
      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
    </Link>
  );
}
