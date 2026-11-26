"use client";

import {
  HomePageShapesBackground,
  HOME_PAGE_SHAPES_CONFIG,
  type MultiShapeSpringsCanvasConfig,
} from "@/components/marketing/home-page-shapes-background";
import { PrototypeComponent } from "@/components/marketing/prototype-target";

const SHAPES_CONFIG: MultiShapeSpringsCanvasConfig = {
  ...HOME_PAGE_SHAPES_CONFIG,
  shapeCount: 50,
  mobileShapeCount: 80,
  entranceCenterPop: false,
  entrancePopInPlace: true,
  shapeEntranceDelay: 0.1,
  shapeEntranceStagger: 0.12,
  shapeEntranceOrder: "random",
};

const COLOR_ADJUST = { value: 1.1, saturation: 1.19 };
const DRAW_ALPHA_RANGE = { lower: 0.85, upper: 1 };
const STROKE_STYLE = {
  dotSize: 1.15,
  borderThickness: 1.24,
  dotBorderThickness: 1.56,
  whiteBorders: false,
};
const TEXTURE_FILL_STYLE = {
  plainFillOpacity: 0.4,
  gradientFadeOpacity: 0.58,
};

export default function ShapesOnlyPage() {
  return (
    <PrototypeComponent className="relative flex h-svh min-h-svh flex-1 overflow-hidden bg-background">
      <HomePageShapesBackground
        config={SHAPES_CONFIG}
        colorScheme="electric-pop"
        colorAdjust={COLOR_ADJUST}
        drawAlphaRange={DRAW_ALPHA_RANGE}
        strokeStyle={STROKE_STYLE}
        textureFillStyle={TEXTURE_FILL_STYLE}
      />
    </PrototypeComponent>
  );
}
