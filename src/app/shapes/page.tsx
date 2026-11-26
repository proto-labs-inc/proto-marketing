import type { Metadata } from "next";

import { MarketingRoot } from "@/components/marketing/marketing-root";
import ShapesOnlyPage from "./shapes-only-page";

import "../(marketing)/marketing.css";

export const metadata: Metadata = {
  title: "Shapes | Proto",
  description: "Interactive shapes from the Proto landing page.",
};

export default function ShapesRoute() {
  return (
    <MarketingRoot className="flex min-h-svh flex-col antialiased">
      <ShapesOnlyPage />
    </MarketingRoot>
  );
}
