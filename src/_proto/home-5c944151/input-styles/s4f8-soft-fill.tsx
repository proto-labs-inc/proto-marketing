"use client";

import type { ReactElement } from "react";
import styles from "./s4f8-soft-fill.module.css";

export default function InputStyle({ original }: { original: ReactElement }) {
  return <div className={styles.controls}>{original}</div>;
}
