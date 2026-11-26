import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import styles from "./page.module.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Early access | Proto",
};

export default function EarlyAccessMessagePage() {
  return (
    <main className={styles.page}>
      <h1 className={`${styles.message} ${dmSans.className}`}>
        Get early access at <span className={styles.domain}>prototypes.fun</span>
      </h1>
    </main>
  );
}
