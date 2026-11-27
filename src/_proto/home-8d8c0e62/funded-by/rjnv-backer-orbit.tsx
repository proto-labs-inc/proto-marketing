"use client";

import type * as React from "react";

import Image from "next/image";

import { BACKERS, type Backer } from "@/components/marketing/funded-by-content";
import {
  inviteBlockClassName,
  inviteContentShellClass,
} from "@/components/marketing/invite-layout-classes";
import { cn } from "@/lib/utils";

import styles from "./rjnv-backer-orbit.module.css";

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
        <Image alt="" draggable={false} sizes="60px" src={backer.portrait} />
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
          aria-labelledby="backer-orbit-heading"
          className={styles.root}
          data-proto-id="funded-by-section"
        >
          <div className={styles.core}>
            <span aria-hidden="true" className={styles.ycMark}>
              Y
            </span>
            <span>
              <small id="backer-orbit-heading">Funded by</small>
              Y Combinator
            </span>
          </div>
          <div aria-hidden="true" className={styles.track} />
          {BACKERS.map((backer, index) => (
            <BackerPortrait
              backer={backer}
              className={POSITION_CLASSES[index]}
              key={backer.name}
            />
          ))}
          <p className={styles.instruction}>
            Hover the orbit to meet the angels
          </p>
        </section>
      </div>
    </div>
  );
}
