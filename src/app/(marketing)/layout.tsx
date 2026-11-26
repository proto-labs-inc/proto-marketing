import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

import { MacintoshMenuBar } from "@/components/marketing/macintosh-menu-bar";
import { MarketingRoot } from "@/components/marketing/marketing-root";
import HomePage from "@/components/marketing/home-page";
import { MarketingThemePicker } from "@/components/marketing/theme-picker";
import { cn } from "@/lib/utils";

import "./marketing.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const chicago = localFont({
  src: "./fonts/ChiKareGo2.woff2",
  variable: "--font-chicago",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proto",
  description: "The Designer's IDE",
};

/**
 * The marketing surface: what signed-out visitors see at the root and everyone
 * can see at /landing. The app's
 * root layout still wraps it (DM Sans, the app's theme provider); everything the
 * marketing page styles lives inside MarketingRoot.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingRoot
      className={cn(
        dmSans.variable,
        chicago.variable,
        "flex min-h-svh flex-col antialiased",
      )}
    >
      <MacintoshMenuBar />
      <MarketingThemePicker />
      <HomePage />
      {children}
    </MarketingRoot>
  );
}
