"use client";

import type { ReactElement } from "react";
import styles from "./k9r3-crisp-outline.module.css";

export default function InputStyle({ original }: { original: ReactElement }) {
  return <div className={styles.controls}>{original}</div>;
}
