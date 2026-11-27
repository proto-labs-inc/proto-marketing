"use client";

import type * as React from "react";

import Image from "next/image";

import { BACKERS, type Backer } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./gfyg-loose-cluster.module.css";

const POSITION_CLASSES = [
  styles.person1,
  styles.person2,
  styles.person3,
  styles.person4,
  styles.person5,
  styles.person6,
];

function BackerPortrait({
  backer,
  className,
}: {
  backer: Backer;
  className?: string;
}) {
  return (
    <a
      aria-label={`${backer.name}, ${backer.role}`}
      className={cn(styles.portrait, className)}
      href={backer.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className={styles.image}>
        <Image alt="" draggable={false} src={backer.portrait} />
      </span>
      <span className={styles.profile}>
        <strong>{backer.name}</strong>
        <small>{backer.role}</small>
        <span>{backer.detail}</span>
      </span>
    </a>
  );
}

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

  return (
    <div className={inviteBlockClassName}>
      <div
        className={cn(inviteContentShellClass, "mt-6")}
        data-proto-id="funded-by-section"
      >
        <section
          aria-label="Proto angel investors"
          className={styles.root}
          data-proto-id="funded-by-section"
        >
          {BACKERS.map((backer, index) => (
            <BackerPortrait
              backer={backer}
              className={POSITION_CLASSES[index]}
              key={backer.name}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
