import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

import { MemoShapes } from "./memo-shapes";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const chicago = localFont({
  src: "../(marketing)/fonts/ChiKareGo2.woff2",
  variable: "--font-chicago",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Memo | Proto",
};

export default function MemoPage() {
  return <div className={`${dmSans.variable} ${chicago.variable}`}><MemoShapes frameOrigin={process.env.PROTO_CLOUD ?? null} /></div>;
}
