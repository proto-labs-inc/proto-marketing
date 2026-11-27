"use client";

import type { ReactElement } from "react";
import { motion, useReducedMotion } from "motion/react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteBodyClass,
  inviteBodyLineHighlightClass,
  inviteContentShellClass,
  inviteInteractiveClass,
} from "@/components/marketing/invite-layout-classes";
import {
  PARTNER_FADE_UP_DURATION,
  partnerEaseOut,
  partnerFadeUpHidden,
  partnerFadeUpVisible,
  useEntranceReady,
} from "@/components/marketing/partner-page-motion";
import { cn } from "@/lib/utils";

const LINK_CLASS = cn(
  inviteInteractiveClass,
  "font-medium text-inherit underline decoration-current/30 underline-offset-[3px] hover:decoration-current",
);

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

  const reduceMotion = useReducedMotion();
  const ready = useEntranceReady();
  const entered = ready || reduceMotion;

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <motion.p
          className={cn(inviteBodyClass, "text-foreground/70!")}
          initial={partnerFadeUpHidden}
          animate={entered ? partnerFadeUpVisible : partnerFadeUpHidden}
          transition={{
            duration: PARTNER_FADE_UP_DURATION,
            ease: partnerEaseOut,
            delay: 0.68,
          }}
        >
          <span className={inviteBodyLineHighlightClass}>
            {"Funded by "}
            <a
              className={LINK_CLASS}
              href="https://www.ycombinator.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Y Combinator
            </a>
            {", "}
            {BACKERS.map((backer, index) => (
              <span key={backer.name}>
                {index > 0 && index === BACKERS.length - 1 ? ", and " : index > 0 ? ", " : ""}
                <a
                  className={LINK_CLASS}
                  href={backer.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {backer.name}
                </a>
              </span>
            ))}
            {"."}
          </span>
        </motion.p>
      </div>
    </div>
  );
}
