"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EarlyAccessContent } from "@/app/(marketing)/early-access/early-access-content";
import { EarlyAccessContent as EarlyAccessApplicationContent } from "@/app/(marketing)/early-access/application/early-access-content";
import { PrototypeComponent } from "@/components/marketing/prototype-target";

import { EarlyAccessHeader } from "./early-access-header";
import { HomePageCopyBlock } from "./home-page-copy-block";
import { FundedBySection } from "./funded-by-section";
import { getHomeShapePaletteColor } from "./shape-colors-content";
import {
  HOME_PAGE_SHAPES_CONFIG,
  HomePageShapesBackground,
} from "./home-page-shapes-background";
import styles from "./home-page.module.css";

// The funding proof settles before the shapes arrive, preserving the
// prototype's copy -> backers -> canvas entrance rhythm.
const FUNDED_BY_SHAPES_CONFIG = {
  ...HOME_PAGE_SHAPES_CONFIG,
  shapeEntranceDelay: 1.3,
};

const HOME_PAGE_COLOR_ADJUST = {
  value: 1.1,
  saturation: 1.19,
} as const;

const HOME_PAGE_PINK = `rgb(${getHomeShapePaletteColor("pink", "electric-pop", HOME_PAGE_COLOR_ADJUST).join(" ")})`;
const HOME_DRAW_ALPHA_RANGE = { lower: 0.85, upper: 1 };
const HOME_STROKE_STYLE = {
  dotSize: 1.15,
  borderThickness: 1.24,
  dotBorderThickness: 1.56,
  whiteBorders: false,
};
const HOME_TEXTURE_FILL_STYLE = {
  plainFillOpacity: 0.4,
  gradientFadeOpacity: 0.58,
};

const StableShapesBackground = memo(HomePageShapesBackground);
const StableHomePageCopyBlock = memo(HomePageCopyBlock);
const StableFundedBySection = memo(FundedBySection);
const StableEarlyAccessContent = memo(EarlyAccessContent);
const StableEarlyAccessApplicationContent = memo(EarlyAccessApplicationContent);

function isEarlyAccessPath(pathname: string) {
  return pathname === "/early-access" || pathname === "/early-access/application";
}

export default function HomePage() {
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<"home" | "access">(
    isEarlyAccessPath(pathname) ? "access" : "home",
  );

  useEffect(() => {
    setActiveView(isEarlyAccessPath(pathname) ? "access" : "home");
  }, [pathname]);

  const navigateToAccess = useCallback(() => setActiveView("access"), []);
  const navigateToHome = useCallback(() => setActiveView("home"), []);

  if (pathname !== "/" && pathname !== "/landing" && !isEarlyAccessPath(pathname)) return null;
  const accessActive = activeView === "access";

  return (
    <PrototypeComponent className={styles.shell} data-active-view={activeView}>
        {/* Keep the page structure stable so saved comment targets still resolve in the preview. */}
        <StableShapesBackground
          className={`absolute inset-0 z-10 overflow-hidden bg-transparent ${styles.shapeView} ${accessActive ? styles.shapeAway : ""}`}
          config={FUNDED_BY_SHAPES_CONFIG}
          colorScheme="electric-pop"
          colorAdjust={HOME_PAGE_COLOR_ADJUST}
          drawAlphaRange={HOME_DRAW_ALPHA_RANGE}
          strokeStyle={HOME_STROKE_STYLE}
          textureFillStyle={HOME_TEXTURE_FILL_STYLE}
        />
        <div
          className={`${styles.view} ${styles.homeView} ${accessActive ? styles.homeAway : ""}`}
          aria-hidden={accessActive}
          inert={accessActive}
        >
          <div className={styles.earlyAccessHeader}>
            <EarlyAccessHeader pink={HOME_PAGE_PINK} onNavigate={navigateToAccess} />
          </div>
          <div className={styles.homeContent}>
            <StableHomePageCopyBlock earlyAccessPink={HOME_PAGE_PINK} onNavigate={navigateToAccess} />
            <StableFundedBySection />
          </div>
        </div>
        <div
          className={`${styles.view} ${styles.accessView} ${pathname !== "/early-access/application" ? styles.accessWithHomeBack : ""} ${accessActive ? styles.accessPresent : ""}`}
          aria-hidden={!accessActive}
          inert={!accessActive}
        >
          {pathname === "/early-access/application" ? (
            <StableEarlyAccessApplicationContent
              onNavigate={navigateToHome}
              backClassName={`${styles.back} ${accessActive ? styles.backVisible : ""}`}
              backHidden={!accessActive}
            />
          ) : (
            <StableEarlyAccessContent
              active={accessActive}
              onNavigate={navigateToHome}
              backClassName={`${styles.back} ${accessActive ? styles.backVisible : ""}`}
              backHidden={!accessActive}
            />
          )}
        </div>
    </PrototypeComponent>
  );
}
