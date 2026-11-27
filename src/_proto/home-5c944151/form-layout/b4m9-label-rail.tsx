"use client";

import { cloneElement, type ReactElement } from "react";
import styles from "./b4m9-label-rail.module.css";

type FormProps = { className?: string };

export default function Variant({ original }: { props: Record<string, unknown>; scope: Record<string, unknown>; original: ReactElement<FormProps> }) {
  return cloneElement(original, { className: `${original.props.className ?? ""} ${styles.layout}` });
}
