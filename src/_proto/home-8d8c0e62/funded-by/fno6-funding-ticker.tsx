"use client";

import type * as React from "react";

import { useState } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./fno6-funding-ticker.module.css";

type TickerItem = {
  name: string;
  role: string;
  href: string;
};

const Y_COMBINATOR_ITEM: TickerItem = {
  name: "Y Combinator",
  role: "Accelerator",
  href: "https://www.ycombinator.com/",
};

const BASE_ITEMS: TickerItem[] = [
  Y_COMBINATOR_ITEM,
  ...BACKERS.map((backer) => ({
    name: backer.name,
    role: backer.role,
    href: backer.href,
  })),
];

const TRACK_ITEMS = [...BASE_ITEMS, ...BASE_ITEMS];

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

  const [marketState, setMarketState] = useState<"running" | "paused">(
    "running",
  );
  const [spotlight, setSpotlight] = useState<TickerItem>(Y_COMBINATOR_ITEM);
  const paused = marketState === "paused";

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          aria-labelledby="funding-ticker-heading"
          className={cn(styles.root, paused && styles.paused)}
          data-proto-id="funded-by-section"
        >
          <div className={styles.board}>
            <div className={styles.boardHead}>
              <span>PROTO BACKING INDEX</span>
              <span className={styles.live}>
                <i aria-hidden="true" />
                {" LIVE"}
              </span>
            </div>
            <div className={styles.spotlight}>
              <span className={styles.symbol}>PRTO</span>
              <h2 id="funding-ticker-heading">
                <a
                  href={spotlight.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {spotlight.name}
                  <small>{spotlight.role}</small>
                </a>
              </h2>
              <span className={styles.gain}>▲ ALL IN</span>
            </div>
            <div className={styles.window}>
              <div className={styles.track}>
                {TRACK_ITEMS.map((item, index) => (
                  <a
                    href={item.href}
                    key={`${item.name}-${index}`}
                    onClick={() => setSpotlight(item)}
                    onFocus={() => setSpotlight(item)}
                    onMouseEnter={() => setSpotlight(item)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>
                      {item.name}
                      <small>{item.role}</small>
                    </span>
                    <small>+100%</small>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <button
            className={styles.toggle}
            onClick={() => setMarketState(paused ? "running" : "paused")}
            type="button"
          >
            {paused ? "Open the market" : "Pause the market"}
          </button>
        </section>
      </div>
    </div>
  );
}
