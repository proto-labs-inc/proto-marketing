import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Proto",
  description: "A prototyping tool for the idea phase of building.",
  openGraph: {
    title: "Proto",
    description: "The Designer's IDE",
    siteName: "Proto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proto",
    description: "The Designer's IDE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", dmSans.variable)}>
      <body className="min-h-svh bg-background antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
