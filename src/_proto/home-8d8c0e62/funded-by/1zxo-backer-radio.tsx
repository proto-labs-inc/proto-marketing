"use client";

import type * as React from "react";

import { useState } from "react";

import { BACKERS, type Backer } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./1zxo-backer-radio.module.css";

const WAVE_BARS = Array.from({ length: 17 }, (_, index) => index);

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

  const [active, setActive] = useState<Backer>(BACKERS[0]);

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          aria-labelledby="backer-radio-heading"
          className={styles.root}
          data-proto-id="funded-by-section"
        >
          <div className={styles.display}>
            <span className={styles.frequency}>PROTO FM · 20.26</span>
            <span className={styles.nowPlaying}>Now backing</span>
            <h2 id="backer-radio-heading">
              <a href={active.href} rel="noopener noreferrer" target="_blank">
                {active.name}
              </a>
            </h2>
            <p>With Y Combinator on the signal</p>
            <div aria-hidden="true" className={styles.wave}>
              {WAVE_BARS.map((bar) => (
                <span key={bar} />
              ))}
            </div>
          </div>
          <div className={styles.controls}>
            <span className={styles.controlLabel}>Tune the backers</span>
            <div
              aria-label="Choose a backer"
              className={styles.dial}
              role="tablist"
            >
              {BACKERS.map((backer, index) => (
                <a
                  aria-current={active.name === backer.name ? "true" : undefined}
                  className={styles.station}
                  href={backer.href}
                  key={backer.name}
                  onClick={() => setActive(backer)}
                  onFocus={() => setActive(backer)}
                  onMouseEnter={() => setActive(backer)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{backer.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
