"use client";

import type { ReactElement } from "react";
import styles from "./u6n2-underline.module.css";

export default function InputStyle({ original }: { original: ReactElement }) {
  return <div className={styles.controls}>{original}</div>;
}
