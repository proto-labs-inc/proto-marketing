"use client";

import { PrototypeComponent } from "@/components/marketing/prototype-target";

import { MacDownload } from "./mac-download";
import {
  HOME_PAGE_SHAPES_CONFIG,
  HomePageShapesBackground,
} from "./home-page-shapes-background";

// Match the shape burst to the download control at 38% of the viewport.
const DOWNLOAD_SHAPES_CONFIG = {
  ...HOME_PAGE_SHAPES_CONFIG,
  shapeEntranceDelay: 0.5,
  sharedPopYFactor: 0.38,
};

export default function DownloadPage() {
  return (
    <PrototypeComponent className="flex h-svh min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <PrototypeComponent className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
        <HomePageShapesBackground
          config={DOWNLOAD_SHAPES_CONFIG}
          colorScheme="electric-pop"
          colorAdjust={{
            value: 1.1,
            saturation: 1.19,
          }}
          drawAlphaRange={{
            lower: 0.85,
            upper: 1,
          }}
          strokeStyle={{
            dotSize: 1.15,
            borderThickness: 1.24,
            dotBorderThickness: 1.56,
            whiteBorders: false,
          }}
          textureFillStyle={{
            plainFillOpacity: 0.4,
            gradientFadeOpacity: 0.58,
          }}
        />
        <MacDownload />
      </PrototypeComponent>
    </PrototypeComponent>
  );
}
