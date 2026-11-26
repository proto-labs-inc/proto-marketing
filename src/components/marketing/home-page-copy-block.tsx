"use client";

import { PrototypeComponent } from "@/components/marketing/prototype-target";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

import {
  inviteBlockClassName,
  inviteBodyClass,
  inviteBodyLineHighlightClass,
  inviteBodyStackClass,
  inviteInteractiveClass,
  inviteLineHighlightClass,
  inviteMotionPassThroughClass,
} from "./invite-layout-classes";
import {
  PARTNER_FADE_UP_DURATION,
  partnerEaseOut,
  partnerFadeUpHidden,
  partnerFadeUpVisible,
  partnerPopSpring,
  useEntranceReady,
} from "./partner-page-motion";
import { HOME_PAGE_COPY } from "./home-page-copy-content";
import { ClaudeMark, CursorMark } from "./home-page-brand-marks";
import { EarlyAccessHeader } from "./early-access-header";
import { getHomeShapePaletteColor } from "./shape-colors-content";
import styles from "./home-page-copy-block.module.css";

/** One entrance sequence: access, headline, body, then backers and shapes. */
export const HOME_PAGE_BODY_ENTRANCE_DELAY = 0.38;

const HEADLINE_ENTRANCE_DELAY = 0.12;
const demoGold = `rgb(${getHomeShapePaletteColor("gold", "electric-pop").join(" ")})`;

const [beforeClaudeCode = "", afterClaudeCode = ""] =
  HOME_PAGE_COPY.body.split("Claude Code");
const [betweenClaudeCodeAndCursor = "", afterCursor = ""] =
  afterClaudeCode.split("Cursor");
const [beforeMidjourney = "", afterMidjourney = ""] =
  afterCursor.split("Midjourney's");

const homePageHeadlineClass =
  "pointer-events-none mb-4 text-center text-balance text-[clamp(2.25rem,7vw,3rem)] leading-[1.3] font-bold tracking-[-0.03em] whitespace-normal text-foreground sm:mb-5 sm:text-[min(4.5rem,6.2vw)] sm:whitespace-nowrap md:mb-7";

const homePageContentShellClass =
  "pointer-events-none mx-auto w-full px-4 text-center sm:px-6 md:px-10";

const homePageBodyStackClass = cn(
  inviteBodyStackClass,
  "mx-auto w-full max-w-[25rem] md:max-w-[37rem]",
);

const headlineEntranceHiddenClass =
  "opacity-0 translate-y-[14px] scale-[0.92] transform-gpu";
const bodyEntranceHiddenClass = "opacity-0 translate-y-[18px] transform-gpu";

function Body({ pink }: { pink: string }) {
  return (
    <p className={cn(inviteBodyClass, "-mx-3 sm:mx-0")}>
      <span className={inviteBodyLineHighlightClass}>
        <strong className="font-bold">{HOME_PAGE_COPY.bodyLead}</strong>
        {beforeClaudeCode}
        <span className="ml-[0.2em] whitespace-nowrap">
          <ClaudeMark />
          Claude Code
        </span>
        {betweenClaudeCodeAndCursor}
        <span className="whitespace-nowrap">
          <CursorMark />
          Cursor
        </span>
        {beforeMidjourney}
        <span className="whitespace-nowrap">
          <span
            aria-hidden="true"
            className="midjourney-brand-mark mr-[0.3em] inline-block h-[1.25em] w-[1.25em] align-[-0.3em]"
          />
          Midjourney&apos;s
        </span>
        {afterMidjourney}
        {" "}
        {HOME_PAGE_COPY.closingLead}
        {" "}
        <span className="md:whitespace-nowrap">
          {HOME_PAGE_COPY.closingPronoun}{" "}
          {HOME_PAGE_COPY.closingAdjective}{" "}
          <span className="whitespace-nowrap">{HOME_PAGE_COPY.closingPhrase}</span>
        </span>
        <br className="sm:hidden" />
        {" "}
        <a
          href="https://x.com/maayanalbert/status/2118872746415509578?a=lRrxwyq5rydNNlX-fTI&s=20"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            "--demo-pink": pink,
            "--demo-gold": demoGold,
          } as CSSProperties}
          className={cn(
            inviteInteractiveClass,
            styles.demoLink,
            "whitespace-nowrap underline underline-offset-4 hover:decoration-2 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4",
          )}
        >
          See demo
        </a>
      </span>
    </p>
  );
}

export function HomePageCopyBlock({
  earlyAccessPink,
  onNavigate,
}: {
  earlyAccessPink: string;
  onNavigate: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const ready = useEntranceReady();

  if (reduceMotion) {
    return (
      <PrototypeComponent
        id="home-page-copy-block"
        className={inviteBlockClassName}
      >
        <div className={homePageContentShellClass}>
          <EarlyAccessHeader className={styles.desktopEarlyAccess} pink={earlyAccessPink} onNavigate={onNavigate} />
          <h1 className={homePageHeadlineClass}>
            <span className={inviteLineHighlightClass}>
              {HOME_PAGE_COPY.headline}
            </span>
          </h1>
          <div className={homePageBodyStackClass}>
            <Body pink={earlyAccessPink} />
          </div>
        </div>
      </PrototypeComponent>
    );
  }

  return (
    <PrototypeComponent
      id="home-page-copy-block"
      className={inviteBlockClassName}
    >
      <div className={homePageContentShellClass}>
        {ready ? (
          <motion.div
            className={inviteMotionPassThroughClass}
            initial={{ opacity: 0, transform: "translateY(14px) scale(0.92)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            transition={partnerPopSpring}
          >
            <EarlyAccessHeader className={styles.desktopEarlyAccess} pink={earlyAccessPink} onNavigate={onNavigate} />
          </motion.div>
        ) : (
          <div
            className={cn(
              inviteMotionPassThroughClass,
              headlineEntranceHiddenClass,
            )}
            aria-hidden
          >
            <EarlyAccessHeader className={styles.desktopEarlyAccess} pink={earlyAccessPink} onNavigate={onNavigate} />
          </div>
        )}
        <h1 className={homePageHeadlineClass}>
          {ready ? (
            <motion.span
              className={cn(inviteMotionPassThroughClass, "inline-block max-w-full")}
              initial={{ opacity: 0, transform: "translateY(14px) scale(0.92)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              transition={{
                ...partnerPopSpring,
                delay: HEADLINE_ENTRANCE_DELAY,
              }}
            >
              <span className={inviteLineHighlightClass}>
                {HOME_PAGE_COPY.headline}
              </span>
            </motion.span>
          ) : (
            <span
              className={cn(
                inviteMotionPassThroughClass,
                headlineEntranceHiddenClass,
                "inline-block max-w-full",
              )}
              aria-hidden
            >
              <span className={inviteLineHighlightClass}>
                {HOME_PAGE_COPY.headline}
              </span>
            </span>
          )}
        </h1>
        <div className={homePageBodyStackClass}>
          {ready ? (
            <motion.div
              className={inviteMotionPassThroughClass}
              initial={partnerFadeUpHidden}
              animate={partnerFadeUpVisible}
              transition={{
                duration: PARTNER_FADE_UP_DURATION,
                ease: partnerEaseOut,
                delay: HOME_PAGE_BODY_ENTRANCE_DELAY,
              }}
            >
              <Body pink={earlyAccessPink} />
            </motion.div>
          ) : (
            <div
              className={cn(
                inviteMotionPassThroughClass,
                bodyEntranceHiddenClass,
              )}
              aria-hidden
            >
              <Body pink={earlyAccessPink} />
            </div>
          )}
        </div>
      </div>
    </PrototypeComponent>
  );
}
