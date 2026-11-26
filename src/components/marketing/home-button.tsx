"use client";

import Link from "next/link";
import type { ComponentProps, SVGProps } from "react";
import { cn } from "@/lib/utils";

function OutlineHomeIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V19.5a.75.75 0 0 0 .75.75H9.75v-4.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 0 .75-.75V9.75M8.25 20.25h7.5"
      />
    </svg>
  );
}

export function HomeButton({ className, ...props }: Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link
      aria-label="Home"
      title="Home"
      {...props}
      className={cn(
        "theme-picker-home pointer-events-auto absolute z-50 left-3 top-3 inline-flex size-[var(--marketing-header-control-height)] items-center justify-center rounded-xl border-0 bg-muted/90 text-foreground backdrop-blur-sm transition-colors motion-reduce:transition-none hover:bg-muted focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 md:left-4 md:top-4",
        className,
      )}
    >
      <OutlineHomeIcon className="size-4" />
    </Link>
  );
}
