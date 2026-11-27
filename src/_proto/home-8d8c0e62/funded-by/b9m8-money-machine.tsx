"use client";

import type * as React from "react";

import { useState } from "react";

import { BACKERS } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./b9m8-money-machine.module.css";

const COIN_CLASSES = [
  styles.coin1,
  styles.coin2,
  styles.coin3,
  styles.coin4,
  styles.coin5,
  styles.coin6,
];

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

  const [machineState, setMachineState] = useState<"idle" | "raining">(
    "idle",
  );
  const raining = machineState === "raining";

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          aria-labelledby="money-machine-heading"
          className={cn(styles.root, raining && styles.raining)}
          data-proto-id="funded-by-section"
        >
          <div className={styles.copy}>
            <span className={styles.kicker}>Funding proof / series 01</span>
            <h2 id="money-machine-heading">
              Serious backing.
              <br />
              Silly amounts of belief.
            </h2>
            <p>
              Y Combinator and six builders put their money where our
              prototype is.
            </p>
            <button
              className={styles.trigger}
              onClick={() => setMachineState(raining ? "idle" : "raining")}
              type="button"
            >
              {raining ? "Pocket the change" : "Make it rain"}
            </button>
          </div>
          <div aria-live="polite" className={styles.stage}>
            <span aria-hidden="true" className={styles.double}>
              $$
            </span>
            <span className={styles.stamp}>
              {raining ? "Backed × 6" : "Funded by YC"}
            </span>
            {BACKERS.map((backer, index) => (
              <a
                className={cn(styles.coin, COIN_CLASSES[index])}
                href={backer.href}
                key={backer.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span aria-hidden="true">$</span>
                <small>
                  {backer.name}
                  <span>{backer.role}</span>
                </small>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
