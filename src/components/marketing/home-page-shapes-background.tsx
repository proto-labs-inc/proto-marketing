"use client";

import { PrototypeComponent } from "@/components/marketing/prototype-target";
import { useTheme } from "@/components/marketing/marketing-root";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import {
  getProtoColor,
  PROTO_COLORS,
  PROTO_SHAPES,
  type ProtoColorId,
  type ProtoRgb,
  type ProtoShapeId,
  type ProtoTextureId,
} from "@/lib/marketing/shapes/proto-shape-content";
import {
  adjustShapeColor,
  getHomeShapePaletteColor,
  SHAPE_COLORS_BASELINE_SCHEME,
  type ShapeColorAdjust,
  type ShapeColorsVariant,
  type ShapeDrawAlphaRange,
} from "./shape-colors-content";
import {
  PARTNER_SHAPE_REVEAL_DELAY_EXTRA,
} from "./partner-page-motion";
import {
  getIsMobileViewport,
  subscribeToMobileViewport,
} from "@/lib/marketing/mobile-viewport";
import { HOME_PAGE_BODY_ENTRANCE_DELAY } from "./home-page-copy-block";
import {
  mockContributorToHomePageShape,
  sampleMockContributors,
} from "./home-page-mock-contributors";
import { bindSpringsCanvasPointerHandlers } from "@/lib/marketing/shapes/springs-canvas-pointer";
import {
  getDragAttributionTooltipOffsetY,
  updateDragAttributionTooltipElement,
} from "@/lib/marketing/shapes/springs-drag-attribution-tooltip";
import { DragAttributionTooltipLayer } from "@/lib/marketing/shapes/drag-attribution-tooltip-layer";
import {
  createSpringsCubeSimulation,
  drawSpringsCubeSimulation,
  pickClosestParticle as pickClosestCubeParticle,
  stepSpringsCubeSimulation,
  updateSpringsCubeSimulationBounds,
  type SpringsCubeSimulation,
} from "@/lib/marketing/shapes/springs-cube-simulation";
import {
  getShapeStackDepth,
  resolveInterShapeFaceCollisions,
  resolveSelfCollisions,
  type CollidableParticle,
  type ShapeFaceSet,
} from "@/lib/marketing/shapes/springs-inter-shape-collisions";
import {
  createSpringsPentagonSimulation,
  drawSpringsPentagonSimulation,
  pickClosestParticle as pickClosestPentagonParticle,
  stepSpringsPentagonSimulation,
  updateSpringsPentagonSimulationBounds,
  type SpringsPentagonSimulation,
} from "@/lib/marketing/shapes/springs-pentagon-simulation";
import {
  createSpringsPrismSimulation,
  drawSpringsPrismSimulation,
  pickClosestParticle as pickClosestPrismParticle,
  stepSpringsPrismSimulation,
  updateSpringsPrismSimulationBounds,
  type SpringsPrismSimulation,
} from "@/lib/marketing/shapes/springs-prism-simulation";
import {
  createSpringsSquareSimulation,
  drawSpringsSquareSimulation,
  pickClosestParticle as pickClosestSquareParticle,
  SQUARE_COLLISION_EDGES,
  SQUARE_SPRING_PAIRS,
  stepSpringsSquareSimulation,
  updateSpringsSquareSimulationBounds,
  type SpringsSquareSimulation,
} from "@/lib/marketing/shapes/springs-square-simulation";
import {
  createSpringsTriangleSimulation,
  drawSpringsTriangleSimulation,
  PARTICLE_PICK_RADIUS,
  PARTICLE_PICK_RADIUS_TOUCH,
  pickClosestParticle as pickClosestTriangleParticle,
  stepSpringsTriangleSimulation,
  updateSpringsTriangleSimulationBounds,
  type SpringsTriangleSimulation,
} from "@/lib/marketing/shapes/springs-triangle-simulation";
import {
  PROTO_TEXTURES,
  getShapeHandleDotOutlineWidth,
  getShapeHandleDotRadius,
  getPrototypeShapeLayoutScales,
  getShapeSpringLineWidth,
  getPageBackgroundRgb,
  type ShapeStrokeStyle,
  type ShapeTextureFillStyle,
} from "@/lib/marketing/shapes/shape-textures";
import {
  rotateSpringsSimulationAroundCentroid,
  scaleSpringsSimulationAroundCentroid,
} from "@/lib/marketing/shapes/springs-physics-scale";

type CanvasSize = {
  cssWidth: number;
  cssHeight: number;
  dpr: number;
};

type PointerInput = {
  pointerX: number;
  pointerY: number;
  pointerDown: boolean;
};

type SpringsSimulation =
  | SpringsTriangleSimulation
  | SpringsCubeSimulation
  | SpringsPentagonSimulation
  | SpringsPrismSimulation
  | SpringsSquareSimulation;

type ShapeRuntime = {
  create: (
    width: number,
    height: number,
    x: number,
    y: number,
  ) => SpringsSimulation;
  updateBounds: (sim: SpringsSimulation, width: number, height: number) => void;
  pick: (
    sim: SpringsSimulation,
    x: number,
    y: number,
    pickRadius: number,
  ) => void;
  step: (sim: SpringsSimulation, input: PointerInput) => void;
  draw: (
    ctx: CanvasRenderingContext2D,
    sim: SpringsSimulation,
    color: ProtoRgb,
    texture: ProtoTextureId,
    dotScale: number,
    renderScale: number,
    fillOpacityRange?: ShapeDrawAlphaRange,
    strokeStyle?: ShapeStrokeStyle,
    textureFillStyle?: ShapeTextureFillStyle,
  ) => void;
  collisionEdges: readonly (readonly [number, number])[];
  collisionFaces: readonly (readonly number[])[];
};

const TRIANGLE_COLLISION_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [2, 0],
  [1, 3],
] as const;

const CUBE_COLLISION_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 5],
  [5, 6],
  [6, 7],
  [0, 2],
  [4, 3],
  [6, 4],
  [2, 5],
  [7, 2],
  [4, 1],
] as const;

const PENTAGON_COLLISION_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 5],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
] as const;

const PRISM_COLLISION_EDGES = [
  [0, 1],
  [1, 2],
  [2, 0],
  [3, 4],
  [4, 5],
  [5, 3],
  [0, 3],
  [1, 4],
  [2, 5],
] as const;

// Convex faces per shape (mirrors each shape's draw code, which already tiles it
// with convex polygons). Used for per-face SAT so shapes rest tight and nest
// into each other's concave gaps without interlocking.
const TRIANGLE_COLLISION_FACES = [
  [0, 1, 3, 2],
  [0, 1, 4],
  [2, 3, 4],
] as const;

const CUBE_COLLISION_FACES = [
  [2, 3, 7, 1],
  [7, 1, 4],
  [6, 7, 4, 5],
  [7, 3, 0, 4],
  [7, 1, 2, 6],
] as const;

const PENTAGON_COLLISION_FACES = [
  [0, 1, 5],
  [1, 2, 5],
  [2, 3, 5],
  [3, 4, 5],
  [4, 0, 5],
] as const;

const PRISM_COLLISION_FACES = [
  [0, 1, 4, 3],
  [1, 2, 5, 4],
  [2, 0, 3, 5],
  [0, 1, 2],
  [3, 4, 5],
] as const;

const SQUARE_COLLISION_FACES = [
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 2],
  [2, 3, 4],
  [5, 0, 1],
  [5, 1, 6],
  [5, 6, 0],
  [0, 1, 6],
  [1, 7, 8],
  [1, 8, 9],
  [1, 9, 7],
  [7, 8, 9],
] as const;

const SHAPE_RUNTIMES: Record<ProtoShapeId, ShapeRuntime> = {
  triangle: {
    create: (width, height, x, y) =>
      createSpringsTriangleSimulation(width, height, x, y),
    updateBounds: (sim, width, height) =>
      updateSpringsTriangleSimulationBounds(
        sim as SpringsTriangleSimulation,
        width,
        height,
      ),
    pick: (sim, x, y, pickRadius) =>
      pickClosestTriangleParticle(
        sim as SpringsTriangleSimulation,
        x,
        y,
        pickRadius,
      ),
    step: (sim, input) =>
      stepSpringsTriangleSimulation(sim as SpringsTriangleSimulation, input),
    draw: (
      ctx,
      sim,
      color,
      texture,
      dotScale,
      renderScale,
      fillOpacityRange,
      strokeStyle,
      textureFillStyle,
    ) =>
      drawSpringsTriangleSimulation(ctx, sim as SpringsTriangleSimulation, {
        clearBackground: false,
        showHint: false,
        color,
        texture,
        dotScale,
        renderScale,
        fillOpacityRange,
        ...strokeStyle,
        ...textureFillStyle,
      }),
    collisionEdges: TRIANGLE_COLLISION_EDGES,
    collisionFaces: TRIANGLE_COLLISION_FACES,
  },
  cube: {
    create: (width, height, x, y) =>
      createSpringsCubeSimulation(width, height, x, y),
    updateBounds: (sim, width, height) =>
      updateSpringsCubeSimulationBounds(
        sim as SpringsCubeSimulation,
        width,
        height,
      ),
    pick: (sim, x, y, pickRadius) =>
      pickClosestCubeParticle(sim as SpringsCubeSimulation, x, y, pickRadius),
    step: (sim, input) =>
      stepSpringsCubeSimulation(sim as SpringsCubeSimulation, input),
    draw: (
      ctx,
      sim,
      color,
      texture,
      dotScale,
      renderScale,
      fillOpacityRange,
      strokeStyle,
      textureFillStyle,
    ) =>
      drawSpringsCubeSimulation(ctx, sim as SpringsCubeSimulation, {
        clearBackground: false,
        showHint: false,
        color,
        texture,
        dotScale,
        renderScale,
        fillOpacityRange,
        ...strokeStyle,
        ...textureFillStyle,
      }),
    collisionEdges: CUBE_COLLISION_EDGES,
    collisionFaces: CUBE_COLLISION_FACES,
  },
  pentagon: {
    create: (width, height, x, y) =>
      createSpringsPentagonSimulation(width, height, x, y),
    updateBounds: (sim, width, height) =>
      updateSpringsPentagonSimulationBounds(
        sim as SpringsPentagonSimulation,
        width,
        height,
      ),
    pick: (sim, x, y, pickRadius) =>
      pickClosestPentagonParticle(
        sim as SpringsPentagonSimulation,
        x,
        y,
        pickRadius,
      ),
    step: (sim, input) =>
      stepSpringsPentagonSimulation(sim as SpringsPentagonSimulation, input),
    draw: (
      ctx,
      sim,
      color,
      texture,
      dotScale,
      renderScale,
      fillOpacityRange,
      strokeStyle,
      textureFillStyle,
    ) =>
      drawSpringsPentagonSimulation(ctx, sim as SpringsPentagonSimulation, {
        clearBackground: false,
        showHint: false,
        color,
        texture,
        dotScale,
        renderScale,
        fillOpacityRange,
        ...strokeStyle,
        ...textureFillStyle,
      }),
    collisionEdges: PENTAGON_COLLISION_EDGES,
    collisionFaces: PENTAGON_COLLISION_FACES,
  },
  square: {
    create: (width, height, x, y) =>
      createSpringsSquareSimulation(width, height, x, y),
    updateBounds: (sim, width, height) =>
      updateSpringsSquareSimulationBounds(
        sim as SpringsSquareSimulation,
        width,
        height,
      ),
    pick: (sim, x, y, pickRadius) =>
      pickClosestSquareParticle(
        sim as SpringsSquareSimulation,
        x,
        y,
        pickRadius,
      ),
    step: (sim, input) =>
      stepSpringsSquareSimulation(sim as SpringsSquareSimulation, input),
    draw: (
      ctx,
      sim,
      color,
      texture,
      dotScale,
      renderScale,
      fillOpacityRange,
      strokeStyle,
      textureFillStyle,
    ) =>
      drawSpringsSquareSimulation(ctx, sim as SpringsSquareSimulation, {
        clearBackground: false,
        showHint: false,
        color,
        texture,
        dotScale,
        renderScale,
        fillOpacityRange,
        ...strokeStyle,
        ...textureFillStyle,
      }),
    collisionEdges: SQUARE_COLLISION_EDGES,
    collisionFaces: SQUARE_COLLISION_FACES,
  },
  prism: {
    create: (width, height, x, y) =>
      createSpringsPrismSimulation(width, height, x, y),
    updateBounds: (sim, width, height) =>
      updateSpringsPrismSimulationBounds(
        sim as SpringsPrismSimulation,
        width,
        height,
      ),
    pick: (sim, x, y, pickRadius) =>
      pickClosestPrismParticle(sim as SpringsPrismSimulation, x, y, pickRadius),
    step: (sim, input) =>
      stepSpringsPrismSimulation(sim as SpringsPrismSimulation, input),
    draw: (
      ctx,
      sim,
      color,
      texture,
      dotScale,
      renderScale,
      fillOpacityRange,
      strokeStyle,
      textureFillStyle,
    ) =>
      drawSpringsPrismSimulation(ctx, sim as SpringsPrismSimulation, {
        clearBackground: false,
        showHint: false,
        color,
        texture,
        dotScale,
        renderScale,
        fillOpacityRange,
        ...strokeStyle,
        ...textureFillStyle,
      }),
    collisionEdges: PRISM_COLLISION_EDGES,
    collisionFaces: PRISM_COLLISION_FACES,
  },
};

const WARM_START_FRAMES = 90;
const MIN_VALID_CANVAS_HEIGHT = 120;
/**
 * Stack sleeping: a settled shape stops shivering once it's barely moved for a
 * while. It's then frozen (velocities zeroed, step skipped) and treated as an
 * immovable anchor so its neighbours also calm down, until a grab or a
 * fast-moving neighbour wakes it.
 */
/** Per-frame centroid movement below which a shape counts as "barely moving". */
const STACK_SLEEP_MOVE = 1.0;
const STACK_SLEEP_FRAMES = 30;
/** Stack-drop spawn band — spread shapes across the viewport, not just the top. */
const STACK_DROP_SPAWN_Y_MIN = 0.02;
const STACK_DROP_SPAWN_Y_MAX = 0.82;
/** Fixed gap between the shape's floor and the measured headline top. */
const PUBLISHED_SHAPE_FLOAT_TITLE_GAP_PX = 20;
/** Fallback clearance when the headline is not yet in the DOM.  */
const PUBLISHED_SHAPE_FLOAT_TITLE_CLEARANCE = 0.07;
const HOME_PAGE_HEADLINE_SELECTOR = "#home-page-copy-block h1";
/** Don't pin until the pop has opened at least this tall (px). */
const FLOAT_PIN_MIN_EXPANDED_HEIGHT = 52;

function resolveStackDropSpawnYFactor(
  index: number,
  count: number,
  random: () => number,
): number {
  const span = STACK_DROP_SPAWN_Y_MAX - STACK_DROP_SPAWN_Y_MIN;
  const band = count <= 1 ? 0.5 : index / (count - 1);
  const jitterAmplitude = span / Math.max(count * 1.6, 12);
  const jitter = (random() - 0.5) * jitterAmplitude;
  return Math.min(
    STACK_DROP_SPAWN_Y_MAX,
    Math.max(
      STACK_DROP_SPAWN_Y_MIN,
      STACK_DROP_SPAWN_Y_MIN + band * span + jitter,
    ),
  );
}

export type FixedShapeSlotConfig = {
  id: string;
  shapeId: ProtoShapeId;
  colorId: ProtoColorId;
  textureId: ProtoTextureId;
  visualScale: number;
  restFloorFactor: number;
  xFactor: number;
  yFactor: number;
  /** Partner mode only — lifts this shape's floor without shifting other shelves. */
  restFloorSpreadAdjust?: number;
  /** Drop this slot instead of warm-start / center-pop. Overrides config entrance. */
  entranceDrop?: boolean;
  /** Extra seconds before this slot's entrance begins (after global delay + stagger). */
  entranceDelayExtra?: number;
  /** Launch from the bottom edge toward a high shelf — for slots above midline. */
  entranceDropFromBottom?: boolean;
  /** Collapse and pop open at the shape's own resting spot — no drop or travel. */
  entrancePopInPlace?: boolean;
  /** Collapse at the top edge and pop open — falls into the pile from above. */
  entrancePopFromTop?: boolean;
  /** Shown in a tooltip above this shape while it is dragged. */
  attributionLabel?: string;
};

export type MultiShapeSpringsPhysicsMode = "background" | "partner";

export type MultiShapeSpringsCanvasConfig = {
  shapeCount: number;
  /** Use a separate generated shape count on mobile screens. */
  mobileShapeCount?: number;
  seed: number;
  gridCols: number;
  minRestFloorFactor: number;
  maxRestFloorFactor: number;
  minVisualScale: number;
  maxVisualScale: number;
  backgroundShapeScale: number;
  colorMode: "home-palette" | "proto-colors";
  /**
   * `partner` matches PartnerShapeCanvas: plain spring step with per-shape shelf
   * floors plus screen-edge walls.
   * `background` uses the same shelf floors for squares; other shapes also get
   * a per-particle floor clamp after each step.
   */
  physicsMode?: MultiShapeSpringsPhysicsMode;
  /** When set, renders exactly these slots with no random generation. */
  fixedSlots?: readonly FixedShapeSlotConfig[];
  /** Drop shapes from above their slots instead of warm-starting in place. */
  entranceDrop?: boolean;
  /**
   * Collapse warm-started shapes to the vertical center, then let springs pop
   * them open — same reveal as PartnerShapeCanvas on the customize page.
   */
  entranceCenterPop?: boolean;
  /**
   * Collapse warm-started shapes at their own resting spot and pop open there —
   * no vertical or horizontal travel. Applies to every slot unless a slot opts
   * out with its own entrance.
   */
  entrancePopInPlace?: boolean;
  /** Pause before the first shape entrance (seconds). */
  shapeEntranceDelay?: number;
  /** Optional normalized vertical origin for the shared shape burst. */
  sharedPopYFactor?: number;
  /** Stagger per-shape reveal on entrance (seconds). Requires a pop or drop entrance. */
  shapeEntranceStagger?: number;
  /** Order in which piled shapes appear across the width. */
  shapeEntranceOrder?: "left-to-right" | "distributed" | "random";
  /**
   * Fallback label for the drag-attribution tooltip. Per-slot `attributionLabel`
   * takes precedence when set.
   */
  dragAttributionLabel?: string;
  /** When true, shows a contributor label above a shape while it is dragged. */
  showDragAttributionTooltip?: boolean;
  /** Show the contributor label when a mouse or pen hovers over a shape. */
  showHoverAttributionTooltip?: boolean;
  /** Show the contributor label for the last shape clicked. */
  showClickAttributionTooltip?: boolean;
  /**
   * Scale shapes up and keep colors saturated toward the bottom shelf; shrink
   * and lighten them toward the top.
   */
  depthGradient?: boolean;
  /**
   * Shared bottom floor with inter-shape collisions so shapes fall and stack
   * like the proto-shapes canvas.
   */
  pileUp?: boolean;
  /**
   * When false, keeps `backgroundShapeScale` fixed instead of shrinking shapes
   * on narrower viewports (home page default).
   */
  responsiveShapeScale?: boolean;
  /**
   * Random rotation span (radians) applied per shape around its centroid. Each
   * shape gets a uniform angle in [0, shapeAngleJitter). Use `Math.PI * 2` for
   * a full 360° spread.
   */
  shapeAngleJitter?: number;
  /** Shape types omitted from generation and rendering. */
  excludeShapeIds?: readonly ProtoShapeId[];
};

export function homePageShapeEntranceDelayS() {
  // Original waited for body fade to finish (+0.55s). Drop that — pop as body starts.
  return HOME_PAGE_BODY_ENTRANCE_DELAY + PARTNER_SHAPE_REVEAL_DELAY_EXTRA;
}

export const HOME_PAGE_SHAPES_CONFIG: MultiShapeSpringsCanvasConfig = {
  shapeCount: 30,
  seed: 0x1a2b3c4d,
  gridCols: 8,
  minRestFloorFactor: 0.08,
  maxRestFloorFactor: 0.995,
  minVisualScale: 0.9,
  maxVisualScale: 1.5,
  backgroundShapeScale: 0.8,
  colorMode: "home-palette",
  physicsMode: "partner",
  entranceDrop: false,
  entranceCenterPop: true,
  pileUp: true,
  shapeEntranceDelay: homePageShapeEntranceDelayS(),
  shapeEntranceStagger: 0,
  depthGradient: false,
  shapeAngleJitter: Math.PI * 2,
  excludeShapeIds: ["square"],
};

/** Desktop home layout — current authored shape size. */
const HOME_PAGE_LARGE_MIN_WIDTH = 1200;
/** Matches partner-page mobile viewport (`sm` breakpoint minus one). */
const HOME_PAGE_MOBILE_MAX_WIDTH = 639;
/** Multipliers on `backgroundShapeScale` below the large breakpoint. */
const HOME_PAGE_SHAPE_SCALE_MEDIUM = 0.88;
const HOME_PAGE_SHAPE_SCALE_MOBILE = 0.6;
/** Narrow screens can't hold the full desktop pile. */
const HOME_PAGE_MOBILE_SHAPE_COUNT = 20;
const HOME_PAGE_MOBILE_GRID_COLS = 4;

function useHomePageMobileViewport() {
  return useSyncExternalStore(
    subscribeToMobileViewport,
    getIsMobileViewport,
    () => false,
  );
}

export function resolveHomePageBackgroundShapeScale(
  cssWidth: number,
  baseScale: number,
  responsive = true,
) {
  if (!responsive) return baseScale;
  if (cssWidth >= HOME_PAGE_LARGE_MIN_WIDTH) return baseScale;
  if (cssWidth > HOME_PAGE_MOBILE_MAX_WIDTH) {
    return baseScale * HOME_PAGE_SHAPE_SCALE_MEDIUM;
  }
  return baseScale * HOME_PAGE_SHAPE_SCALE_MOBILE;
}
/** Blend toward white at the top shelf when depthGradient is enabled. */
const DEPTH_TOP_COLOR_LIGHTEN = 0.78;
/** Canvas alpha at the top shelf — bottom shapes stay fully opaque. */
const DEPTH_TOP_DRAW_ALPHA = 0.38;
/** Particles within this distance of the floor count as resting on it. */
const FLOOR_CONTACT_EPSILON = 1.5;
/** Horizontal velocity multiplier per frame for particles resting on the floor. */
const FLOOR_FRICTION = 0.82;
/** Horizontal speed below which a floor-contact particle is snapped to still. */
const FLOOR_VX_SLEEP = 0.08;

type ShapeSlotConfig = {
  id: string;
  shapeId: ProtoShapeId;
  color: ProtoRgb;
  textureId: ProtoTextureId;
  visualScale: number;
  /** Resting floor as a fraction of canvas height — each shape gets its own layer. */
  restFloorFactor: number;
  xFactor: number;
  yFactor: number;
  restFloorSpreadAdjust?: number;
  entranceDrop?: boolean;
  entranceDelayExtra?: number;
  entranceDropFromBottom?: boolean;
  entrancePopInPlace?: boolean;
  entrancePopFromTop?: boolean;
  attributionLabel?: string;
  /** Rigid rotation (radians) applied to the shape's geometry around its centroid. */
  rotation?: number;
  /** Pinned above the headline until the viewer grabs this shape. */
  floatUntilInteraction?: boolean;
};

type FloatAnchor = {
  particles: { px: number; py: number }[];
};

const COLOR_TRANSITION_SPEED = 0.16;

function lerpRgb(from: ProtoRgb, to: ProtoRgb, t: number): ProtoRgb {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
}

function rgbNearEqual(a: ProtoRgb, b: ProtoRgb, epsilon = 0.5): boolean {
  return (
    Math.abs(a[0] - b[0]) <= epsilon &&
    Math.abs(a[1] - b[1]) <= epsilon &&
    Math.abs(a[2] - b[2]) <= epsilon
  );
}

type ShapeSlot = ShapeSlotConfig & {
  sim: SpringsSimulation | null;
  /** In-flight draw color while the active palette is changing. */
  displayColor?: ProtoRgb;
  /** Consecutive frames the centroid has stayed within the sleep radius. */
  stillFrames?: number;
  /** Frozen once settled so it stops shivering; wakes on grab or impact. */
  asleep?: boolean;
  /** Anchor centroid the shape is being measured against while settling. */
  lastCx?: number;
  lastCy?: number;
  /** Pop-in finished — kinematic pin holds the shape above the title. */
  floatPinReady?: boolean;
  lastFloatCx?: number;
  lastFloatCy?: number;
  floatStillFrames?: number;
};

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pickRandom<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function shuffleWithRandom<T>(items: T[], random: () => number) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex]!, items[index]!];
  }
}

function applyShapeAngleJitter(
  slot: ShapeSlotConfig,
  config: MultiShapeSpringsCanvasConfig,
  random: () => number,
): ShapeSlotConfig {
  const span = config.shapeAngleJitter ?? 0;
  if (span <= 0) return slot;
  return { ...slot, rotation: random() * span };
}

function getShapeShelfDepthT(
  restFloorFactor: number,
  minRestFloorFactor: number,
  maxRestFloorFactor: number,
) {
  const span = maxRestFloorFactor - minRestFloorFactor;
  if (span <= 0) return 1;
  return Math.min(
    1,
    Math.max(0, (restFloorFactor - minRestFloorFactor) / span),
  );
}

function getDepthVisualScale(
  depthT: number,
  config: MultiShapeSpringsCanvasConfig,
  baseScale = 1,
) {
  const shelfScale =
    config.minVisualScale +
    depthT * (config.maxVisualScale - config.minVisualScale);
  return shelfScale * baseScale;
}

function getDepthAdjustedColor(color: ProtoRgb, depthT: number): ProtoRgb {
  const lighten = (1 - depthT) * DEPTH_TOP_COLOR_LIGHTEN;
  return [
    Math.round(color[0] + (255 - color[0]) * lighten),
    Math.round(color[1] + (255 - color[1]) * lighten),
    Math.round(color[2] + (255 - color[2]) * lighten),
  ];
}

function getDepthDrawAlpha(
  depthT: number,
  range?: ShapeDrawAlphaRange,
) {
  const lower = range?.lower ?? DEPTH_TOP_DRAW_ALPHA;
  const upper = range?.upper ?? 1;
  return lower + depthT * (upper - lower);
}

function applyDepthGradientToSlot<
  T extends Pick<ShapeSlotConfig, "color" | "restFloorFactor" | "visualScale">,
>(
  slot: T,
  config: MultiShapeSpringsCanvasConfig,
  baseVisualScale = 1,
): T {
  if (!config.depthGradient) return slot;

  const depthT = getShapeShelfDepthT(
    slot.restFloorFactor,
    config.minRestFloorFactor,
    config.maxRestFloorFactor,
  );

  return {
    ...slot,
    visualScale: getDepthVisualScale(depthT, config, baseVisualScale),
    color: getDepthAdjustedColor(slot.color, depthT),
  };
}

function generateUniqueRestFloorFactors(
  count: number,
  random: () => number,
  config: MultiShapeSpringsCanvasConfig,
) {
  const factors = Array.from({ length: count }, (_, index) => {
    const t = count <= 1 ? 0.5 : index / (count - 1);
    return (
      config.minRestFloorFactor +
      t * (config.maxRestFloorFactor - config.minRestFloorFactor)
    );
  });
  shuffleWithRandom(factors, random);
  return factors;
}

function fixedSlotToConfig(
  slot: FixedShapeSlotConfig,
  colorScheme: ShapeColorsVariant,
  colorMode: MultiShapeSpringsCanvasConfig["colorMode"],
  colorAdjust?: ShapeColorAdjust,
): ShapeSlotConfig {
  return {
    id: slot.id,
    shapeId: slot.shapeId,
    color:
      colorMode === "proto-colors"
        ? adjustShapeColor(getProtoColor(slot.colorId).rgb, colorAdjust)
        : getHomeShapePaletteColor(slot.colorId, colorScheme, colorAdjust),
    textureId: slot.textureId,
    visualScale: slot.visualScale,
    restFloorFactor: slot.restFloorFactor,
    xFactor: slot.xFactor,
    yFactor: slot.yFactor,
    restFloorSpreadAdjust: slot.restFloorSpreadAdjust,
    entranceDrop: slot.entranceDrop,
    entranceDelayExtra: slot.entranceDelayExtra,
    entranceDropFromBottom: slot.entranceDropFromBottom,
    entrancePopInPlace: slot.entrancePopInPlace,
    attributionLabel: slot.attributionLabel,
  };
}

function resolveSharedStackPhysics(config: MultiShapeSpringsCanvasConfig) {
  return Boolean(
    config.pileUp ||
      (config.entranceDrop &&
        !config.entrancePopInPlace &&
        !config.entranceCenterPop),
  );
}

function normalizeSlotForPileUp(
  slot: ShapeSlotConfig,
  config: MultiShapeSpringsCanvasConfig,
): ShapeSlotConfig {
  if (!resolveSharedStackPhysics(config)) return slot;
  return { ...slot, restFloorFactor: config.maxRestFloorFactor };
}

function isSlotFloating(
  slot: Pick<ShapeSlotConfig, "floatUntilInteraction" | "id">,
  releasedFloatShapeIds: ReadonlySet<string>,
) {
  return Boolean(
    slot.floatUntilInteraction && !releasedFloatShapeIds.has(slot.id),
  );
}

function resolveSlotUsesSharedStackPhysics(
  slot: Pick<ShapeSlotConfig, "floatUntilInteraction" | "id">,
  config: MultiShapeSpringsCanvasConfig,
  releasedFloatShapeIds: ReadonlySet<string>,
) {
  if (isSlotFloating(slot, releasedFloatShapeIds)) return false;
  return resolveSharedStackPhysics(config);
}

function captureFloatAnchor(sim: SpringsSimulation): FloatAnchor {
  return {
    particles: sim.particles.map((particle) => ({
      px: particle.px,
      py: particle.py,
    })),
  };
}

function applyFloatAnchor(sim: SpringsSimulation, anchor: FloatAnchor) {
  for (let index = 0; index < sim.particles.length; index += 1) {
    const particle = sim.particles[index]!;
    const anchorParticle = anchor.particles[index]!;
    particle.px = anchorParticle.px;
    particle.py = anchorParticle.py;
    particle.vx = 0;
    particle.vy = 0;
  }
}

function finalizeShapeSlotConfig(
  slot: ShapeSlotConfig,
  config: MultiShapeSpringsCanvasConfig,
  random: () => number,
  yFactor = slot.yFactor,
): ShapeSlotConfig {
  let result = applyShapeAngleJitter({ ...slot, yFactor }, config, random);
  if (!result.floatUntilInteraction && resolveSharedStackPhysics(config)) {
    result = { ...result, restFloorFactor: config.maxRestFloorFactor };
  }
  return result;
}

function applySlotDisplayRotation(
  sim: SpringsSimulation,
  rotation: number | undefined,
) {
  if (rotation !== undefined) {
    rotateSpringsSimulationAroundCentroid(sim, rotation);
  }
}

function captureFloatingShapeAnchor(
  slot: ShapeSlot,
  floatAnchorPoses: Map<string, FloatAnchor>,
) {
  if (!slot.sim) return;
  floatAnchorPoses.set(slot.id, captureFloatAnchor(slot.sim));
}

function releaseFloatingShape(
  slot: ShapeSlot,
  cssHeight: number,
  backgroundShapeScale: number,
  config: MultiShapeSpringsCanvasConfig,
  shapes: readonly ShapeSlot[],
  releasedFloatShapeIds: Set<string>,
  floatAnchorPoses: Map<string, FloatAnchor>,
) {
  releasedFloatShapeIds.add(slot.id);
  floatAnchorPoses.delete(slot.id);
  slot.floatUntilInteraction = false;
  slot.floatPinReady = false;
  slot.floatStillFrames = 0;
  slot.lastFloatCx = undefined;
  slot.lastFloatCy = undefined;
  slot.restFloorFactor = config.maxRestFloorFactor;
  slot.asleep = false;
  slot.stillFrames = 0;
  slot.lastCx = undefined;
  slot.lastCy = undefined;

  if (!slot.sim) return;

  const physicsMode = config.physicsMode ?? "background";
  applySlotSimulationMargin(
    slot,
    slot.sim,
    cssHeight,
    backgroundShapeScale,
    physicsMode,
    getSlotRestFloorFactorRange(shapes),
    true,
  );
  slot.sim.floorInset = undefined;
}

function generateShapeSlotConfigs(
  config: MultiShapeSpringsCanvasConfig,
  colorScheme: ShapeColorsVariant,
  colorAdjust?: ShapeColorAdjust,
): ShapeSlotConfig[] {
  const excludedShapeIds = new Set(config.excludeShapeIds ?? []);
  const isExcludedShape = (shapeId: ProtoShapeId) => excludedShapeIds.has(shapeId);

  if (config.fixedSlots?.length) {
    const fixedRandom = createSeededRandom(config.seed >>> 0);
    return config.fixedSlots
      .filter((slot) => !isExcludedShape(slot.shapeId))
      .map((slot) =>
        applyShapeAngleJitter(
          normalizeSlotForPileUp(
            fixedSlotToConfig(
              slot,
              colorScheme,
              config.colorMode,
              colorAdjust,
            ),
            config,
          ),
          config,
          fixedRandom,
        ),
      );
  }

  const runtimeSeed = config.seed >>> 0;
  const random = createSeededRandom(runtimeSeed);
  const fillerCount = config.shapeCount;
  const sampledMocks = sampleMockContributors(
    fillerCount,
    random,
    [],
    config.excludeShapeIds,
  );
  const fillerShapes = sampledMocks.map((mock) =>
    mockContributorToHomePageShape(mock, random),
  );
  const restFloorFactors = generateUniqueRestFloorFactors(
    fillerCount,
    random,
    config,
  );

  const slots: ShapeSlotConfig[] = fillerShapes.map((shape, index) => {
    const col = index % config.gridCols;
    const baseColor =
      config.colorMode === "proto-colors"
        ? adjustShapeColor(getProtoColor(shape.colorId).rgb, colorAdjust)
        : getHomeShapePaletteColor(shape.colorId, colorScheme, colorAdjust);
    const scaleJitter = config.depthGradient ? 0.9 + random() * 0.2 : 1;
    const restFloorFactor = restFloorFactors[index] ?? shape.restFloorFactor;
    const visualScale = config.depthGradient
      ? shape.visualScale
      : config.minVisualScale +
        random() * (config.maxVisualScale - config.minVisualScale);

    return applyDepthGradientToSlot(
      {
        id: String(index),
        shapeId: shape.shapeId,
        color: baseColor,
        textureId: shape.textureId,
        visualScale,
        restFloorFactor,
        xFactor:
          0.02 +
          ((col + 0.5) / config.gridCols) * 0.96 +
          (random() - 0.5) * 0.06,
        yFactor: shape.yFactor,
        attributionLabel: shape.contributorName,
      },
      config,
      scaleJitter,
    );
  });

  const allSlots = slots;

  if (!resolveSharedStackPhysics(config)) {
    return allSlots.map((slot) =>
      finalizeShapeSlotConfig(slot, config, random),
    );
  }

  const shuffled = [...allSlots];
  shuffleWithRandom(shuffled, random);
  const spawnYById = new Map<string, number>();
  shuffled.forEach((slot, spawnIndex) => {
    spawnYById.set(
      slot.id,
      resolveStackDropSpawnYFactor(spawnIndex, shuffled.length, random),
    );
  });

  return allSlots.map((slot) =>
    finalizeShapeSlotConfig(
      slot,
      config,
      random,
      spawnYById.get(slot.id) ?? slot.yFactor,
    ),
  );
}

function getSlotLayout(
  shapeId: ProtoShapeId,
  visualScale: number,
  backgroundShapeScale: number,
) {
  return getPrototypeShapeLayoutScales({
    layoutShapeScale: backgroundShapeScale,
    visualScale,
    isThreePartShape: shapeId === "square",
  });
}

function resolveShapeMargin(
  shapeId: ProtoShapeId,
  visualScale: number,
  backgroundShapeScale: number,
  strokeStyle?: ShapeStrokeStyle,
) {
  const { dotScale, normalizedRenderScale } = getSlotLayout(
    shapeId,
    visualScale,
    backgroundShapeScale,
  );
  const dotSize = strokeStyle?.dotSize ?? 1;
  const borderThickness = strokeStyle?.borderThickness ?? 1;
  const dotBorderThickness = strokeStyle?.dotBorderThickness ?? 1;
  const renderBleed =
    getShapeHandleDotRadius(dotScale, normalizedRenderScale) * dotSize +
    getShapeHandleDotOutlineWidth(normalizedRenderScale, dotBorderThickness) +
    getShapeSpringLineWidth(normalizedRenderScale, borderThickness) / 2;

  return Math.ceil(4 + renderBleed);
}

function getRestFloorY(
  cssHeight: number,
  restFloorFactor: number,
  margin: number,
) {
  return cssHeight * restFloorFactor - margin;
}

/** Bottom inset that raises each shape's floor to its shelf layer. */
function getShelfSimulationMargin(
  cssHeight: number,
  restFloorFactor: number,
  renderMargin: number,
) {
  return Math.ceil(cssHeight * (1 - restFloorFactor) + renderMargin);
}

function getSlotRestFloorFactorRange(
  slots: readonly Pick<ShapeSlotConfig, "restFloorFactor">[],
) {
  if (slots.length === 0) {
    return { min: 1, max: 1 };
  }
  return {
    min: Math.min(...slots.map((slot) => slot.restFloorFactor)),
    max: Math.max(...slots.map((slot) => slot.restFloorFactor)),
  };
}

/**
 * Stretch shelf spacing from the original top layer down to a flush bottom,
 * keeping the highest shelf where the layout authored it.
 */
function spreadRestFloorFactor(
  restFloorFactor: number,
  minRestFloorFactor: number,
  maxRestFloorFactor: number,
) {
  const span = maxRestFloorFactor - minRestFloorFactor;
  if (span <= 0) return 1;
  const t = (restFloorFactor - minRestFloorFactor) / span;
  return minRestFloorFactor + t * (1 - minRestFloorFactor);
}

function applySlotSimulationMargin(
  slot: ShapeSlotConfig,
  sim: SpringsSimulation,
  cssHeight: number,
  backgroundShapeScale: number,
  physicsMode: MultiShapeSpringsPhysicsMode,
  restFloorFactorRange = { min: 1, max: 1 },
  sharedStackPhysics = false,
) {
  const renderMargin = resolveShapeMargin(
    slot.shapeId,
    slot.visualScale,
    backgroundShapeScale,
  );
  if (sharedStackPhysics) {
    sim.margin = renderMargin;
    sim.floorInset = undefined;
    return;
  }
  if (physicsMode === "partner") {
    const spreadFloorFactor = spreadRestFloorFactor(
      slot.restFloorFactor,
      restFloorFactorRange.min,
      restFloorFactorRange.max,
    );
    const adjustedSpreadFloorFactor = Math.max(
      restFloorFactorRange.min,
      spreadFloorFactor - (slot.restFloorSpreadAdjust ?? 0),
    );
    sim.margin = renderMargin;
    sim.floorInset = getShelfSimulationMargin(
      cssHeight,
      adjustedSpreadFloorFactor,
      renderMargin,
    );
    return;
  }

  sim.margin = renderMargin;
  if (slot.shapeId === "square") {
    sim.floorInset = getShelfSimulationMargin(
      cssHeight,
      slot.restFloorFactor,
      renderMargin,
    );
  } else {
    sim.floorInset = undefined;
  }
}

/**
 * Rest non-square shapes on their shelf layer using a per-particle floor.
 * Squares use floorInset instead — same approach as invite follow-up.
 */
function enforceShapeFloor(
  sim: SpringsSimulation,
  floorY: number,
  pinned: readonly CollidableParticle[] = [],
) {
  const pinnedSet = new Set(pinned);

  for (const particle of sim.particles) {
    if (pinnedSet.has(particle)) continue;

    const onFloor = particle.py >= floorY - FLOOR_CONTACT_EPSILON;
    if (!onFloor) continue;

    if (particle.py > floorY) {
      particle.py = floorY;
    }
    if (particle.vy > 0) {
      particle.vy = 0;
    }

    particle.vx *= FLOOR_FRICTION;
    if (Math.abs(particle.vx) < FLOOR_VX_SLEEP) {
      particle.vx = 0;
    }
  }
}

function getSimulationCentroid(sim: SpringsSimulation) {
  let sumX = 0;
  let sumY = 0;
  for (const particle of sim.particles) {
    sumX += particle.px;
    sumY += particle.py;
  }
  const count = sim.particles.length;
  return { x: sumX / count, y: sumY / count };
}

function updateShapeAttributionTooltip(
  tooltip: HTMLDivElement | null,
  labelEl: HTMLSpanElement | null,
  shapes: ShapeSlot[],
  activeShapeId: string | null,
  globalLabel: string | undefined,
  positionAnchor: HTMLElement | null,
  backgroundShapeScale: number,
  useFixedTooltipPosition = true,
) {
  if (!activeShapeId) {
    if (tooltip) tooltip.style.display = "none";
    return;
  }

  const slot = shapes.find((entry) => entry.id === activeShapeId);
  const label = slot?.attributionLabel ?? globalLabel;
  if (!slot?.sim || !label) {
    if (tooltip) tooltip.style.display = "none";
    return;
  }

  const { dotScale, normalizedRenderScale } = getSlotLayout(
    slot.shapeId,
    slot.visualScale,
    backgroundShapeScale,
  );

  updateDragAttributionTooltipElement(
    tooltip,
    labelEl,
    getSimulationCentroid(slot.sim),
    label,
    false,
    positionAnchor,
    getDragAttributionTooltipOffsetY(
      slot.sim.particles,
      dotScale,
      normalizedRenderScale,
    ),
    useFixedTooltipPosition,
  );
}

/** Matches PartnerShapeCanvas — tiny cluster so springs distend on the first live frames. */
const INITIAL_POP_COLLAPSE_FACTOR = 0.04;
/**
 * Minimum gap kept between an in-place pop's collapse point and the shape's
 * floor. The smallest shapes settle with their centroid only a pixel or two
 * above the floor, so collapsing to the centroid would still glue them to the
 * boundary and flatten them. Lifting the collapse point ensures every shape
 * reopens in free space before gravity settles it onto its shelf.
 */
const POP_IN_PLACE_MIN_FLOOR_GAP = 32;
/** Shelves above this factor collapse at the bottom edge so springs distend upward. */
const CENTER_POP_MIDLINE_FACTOR = 0.5;
const BOTTOM_POP_COLLAPSE_Y_FACTOR = 0.97;
/** Shared collapse point for pile-up shapes — aligned with home-page copy shell. */
const SHARED_ENTRANCE_POP_X_FACTOR = 0.5;
/** Matches `sm:top-2/5` on the copy wrapper in home-page/index.tsx. */
const HOME_PAGE_COPY_SHELL_TOP_Y = 0.34;
/** Matches `top-28` (~112px) on the mobile copy wrapper. */
const HOME_PAGE_COPY_SHELL_TOP_Y_MOBILE = 0.14;

function resolveSharedEntrancePopYFactor(cssWidth: number) {
  return cssWidth <= HOME_PAGE_MOBILE_MAX_WIDTH
    ? HOME_PAGE_COPY_SHELL_TOP_Y_MOBILE
    : HOME_PAGE_COPY_SHELL_TOP_Y;
}

function getSimulationVerticalBounds(sim: SpringsSimulation) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (const particle of sim.particles) {
    minY = Math.min(minY, particle.py);
    maxY = Math.max(maxY, particle.py);
  }
  return { minY, maxY, height: maxY - minY };
}

function resolveHomePageLayoutRoot(container: HTMLElement) {
  return container.parentElement?.parentElement ?? container.parentElement ?? container;
}

function measureHomePageHeadlineTopY(container: HTMLElement): number | null {
  const headline = resolveHomePageLayoutRoot(container).querySelector(
    HOME_PAGE_HEADLINE_SELECTOR,
  );
  if (!(headline instanceof HTMLElement)) return null;

  const containerRect = container.getBoundingClientRect();
  const headlineRect = headline.getBoundingClientRect();
  if (containerRect.height <= 0 || headlineRect.height <= 0) return null;

  const topY = headlineRect.top - containerRect.top;
  return Number.isFinite(topY) ? topY : null;
}

function resolvePublishedShapeFloatRestFloorFactor(
  cssWidth: number,
  cssHeight: number,
  titleTopY: number | null,
  margin = 0,
) {
  if (titleTopY !== null && cssHeight > 0) {
    const floorY = titleTopY - PUBLISHED_SHAPE_FLOAT_TITLE_GAP_PX;
    return Math.max(0.12, (floorY + margin) / cssHeight);
  }

  return Math.max(
    0.12,
    resolveSharedEntrancePopYFactor(cssWidth) -
      PUBLISHED_SHAPE_FLOAT_TITLE_CLEARANCE,
  );
}

function resolvePublishedShapeFloatRestFloorFactorForSlot(
  container: HTMLElement,
  cssWidth: number,
  cssHeight: number,
  slot: Pick<ShapeSlotConfig, "shapeId" | "visualScale">,
  backgroundShapeScale: number,
) {
  return resolvePublishedShapeFloatRestFloorFactor(
    cssWidth,
    cssHeight,
    measureHomePageHeadlineTopY(container),
    resolveShapeMargin(slot.shapeId, slot.visualScale, backgroundShapeScale),
  );
}

function resolveFloatPinMinExpandedHeight(
  slot: Pick<ShapeSlotConfig, "shapeId" | "visualScale">,
  backgroundShapeScale: number,
) {
  const { shapeScale } = getSlotLayout(
    slot.shapeId,
    slot.visualScale,
    backgroundShapeScale,
  );
  return FLOAT_PIN_MIN_EXPANDED_HEIGHT * shapeScale;
}

function collapseShapeForPop(
  sim: SpringsSimulation,
  targetX: number,
  targetY: number,
) {
  const centroid = getSimulationCentroid(sim);
  for (const particle of sim.particles) {
    particle.px =
      targetX + (particle.px - centroid.x) * INITIAL_POP_COLLAPSE_FACTOR;
    particle.py =
      targetY + (particle.py - centroid.y) * INITIAL_POP_COLLAPSE_FACTOR;
    particle.vx = 0;
    particle.vy = 0;
  }
}

type ShapeSimulationEntrance = {
  sharedPopYFactor?: number;
  drop?: boolean;
  dropFromBottom?: boolean;
  centerPop?: boolean;
  popInPlace?: boolean;
  popFromTop?: boolean;
};

function resolveSlotEntrance(
  slot: Pick<
    ShapeSlotConfig,
    | "entranceDrop"
    | "entranceDropFromBottom"
    | "entrancePopInPlace"
    | "entrancePopFromTop"
  >,
  config: MultiShapeSpringsCanvasConfig,
) {
  const dropFromBottom = slot.entranceDropFromBottom ?? false;
  const drop =
    dropFromBottom || (slot.entranceDrop ?? config.entranceDrop ?? false);
  const popFromTop = slot.entrancePopFromTop ?? false;
  const popInPlace = drop
    ? false
    : (slot.entrancePopInPlace ?? config.entrancePopInPlace ?? false);
  return {
    sharedPopYFactor: config.sharedPopYFactor,
    drop,
    dropFromBottom,
    popInPlace,
    popFromTop,
    centerPop: drop
      ? false
      : popInPlace || popFromTop || (config.entranceCenterPop ?? false),
  };
}

function slotUsesStaggeredEntrance(
  slot: ShapeSlotConfig,
  config: MultiShapeSpringsCanvasConfig,
) {
  const { drop, centerPop } = resolveSlotEntrance(slot, config);
  return (
    drop ||
    centerPop ||
    (config.entranceDrop ?? false) ||
    (config.entranceCenterPop ?? false) ||
    (config.shapeEntranceDelay ?? 0) > 0 ||
    (config.shapeEntranceStagger ?? 0) > 0
  );
}

function distributeEntranceSlots<T>(slots: readonly T[]): T[] {
  const result: T[] = [];
  const ranges: Array<readonly [number, number]> = [[0, slots.length - 1]];

  for (let index = 0; index < ranges.length; index += 1) {
    const [start, end] = ranges[index]!;
    if (start > end) continue;

    const middle = Math.floor((start + end) / 2);
    result.push(slots[middle]!);
    ranges.push([start, middle - 1], [middle + 1, end]);
  }

  return result;
}

function launchShapeFromBottom(sim: SpringsSimulation, targetFloorY: number) {
  const centroid = getSimulationCentroid(sim);
  const launchVy = -Math.max(
    14,
    Math.min(30, (centroid.y - targetFloorY) * 0.14),
  );
  for (const particle of sim.particles) {
    particle.vy = launchVy;
  }
}

function warmStartSimulation(
  runtime: ShapeRuntime,
  sim: SpringsSimulation,
  floorY: number,
  shapeId: ProtoShapeId,
  physicsMode: MultiShapeSpringsPhysicsMode,
) {
  const idleInput: PointerInput = {
    pointerX: 0,
    pointerY: 0,
    pointerDown: false,
  };

  if (physicsMode === "partner") {
    for (let i = 0; i < WARM_START_FRAMES; i += 1) {
      runtime.step(sim, idleInput);
    }
    return;
  }

  for (let i = 0; i < WARM_START_FRAMES; i += 1) {
    runtime.step(sim, idleInput);
    if (shapeId !== "square") {
      enforceShapeFloor(sim, floorY);
    }
  }
}

function createShapeSimulation(
  slot: ShapeSlotConfig,
  cssWidth: number,
  cssHeight: number,
  backgroundShapeScale: number,
  physicsMode: MultiShapeSpringsPhysicsMode,
  entrance: ShapeSimulationEntrance = {},
  restFloorFactorRange = { min: 1, max: 1 },
  sharedStackPhysics = false,
) {
  const {
    drop = false,
    dropFromBottom = false,
    centerPop = false,
    popInPlace = false,
    popFromTop = false,
  } = entrance;
  const runtime = SHAPE_RUNTIMES[slot.shapeId];
  const spawnX = cssWidth * slot.xFactor;
  const spawnY = dropFromBottom
    ? cssHeight * BOTTOM_POP_COLLAPSE_Y_FACTOR
    : drop
      ? sharedStackPhysics
        ? cssHeight * slot.yFactor
        : cssHeight * Math.max(0.02, slot.yFactor - 0.22)
      : cssHeight * slot.restFloorFactor;
  const sim = runtime.create(cssWidth, cssHeight, spawnX, spawnY);
  scaleSpringsSimulationAroundCentroid(
    sim,
    getSlotLayout(slot.shapeId, slot.visualScale, backgroundShapeScale)
      .shapeScale,
  );

  const floatShape = slot.floatUntilInteraction;
  const margin = resolveShapeMargin(
    slot.shapeId,
    slot.visualScale,
    backgroundShapeScale,
  );
  let floorY = getRestFloorY(cssHeight, slot.restFloorFactor, margin);

  if (!floatShape) {
    applySlotSimulationMargin(
      slot,
      sim,
      cssHeight,
      backgroundShapeScale,
      physicsMode,
      restFloorFactorRange,
      sharedStackPhysics,
    );
  }

  if (!drop) {
    // Floating shapes warm-start without a shelf floor (like PartnerShapeCanvas)
    // so gravity settles them into the canonical orientation before the pop.
    warmStartSimulation(runtime, sim, floorY, slot.shapeId, physicsMode);
    if (centerPop) {
      if (popInPlace) {
        const collapseX = spawnX;
        const collapseY = Math.min(
          getSimulationCentroid(sim).y,
          floorY - POP_IN_PLACE_MIN_FLOOR_GAP,
        );
        collapseShapeForPop(sim, collapseX, collapseY);
      } else if (popFromTop) {
        collapseShapeForPop(
          sim,
          cssWidth * SHARED_ENTRANCE_POP_X_FACTOR,
          cssHeight * STACK_DROP_SPAWN_Y_MIN,
        );
      } else if (sharedStackPhysics) {
        collapseShapeForPop(
          sim,
          cssWidth * SHARED_ENTRANCE_POP_X_FACTOR,
          cssHeight *
            (entrance.sharedPopYFactor ?? resolveSharedEntrancePopYFactor(cssWidth)),
        );
      } else {
        const collapseYFactor =
          slot.restFloorFactor <= CENTER_POP_MIDLINE_FACTOR
            ? BOTTOM_POP_COLLAPSE_Y_FACTOR
            : CENTER_POP_MIDLINE_FACTOR;
        collapseShapeForPop(
          sim,
          cssWidth * slot.xFactor,
          cssHeight * collapseYFactor,
        );
      }
    }
  } else if (dropFromBottom) {
    const floorY = getRestFloorY(
      cssHeight,
      slot.restFloorFactor,
      resolveShapeMargin(slot.shapeId, slot.visualScale, backgroundShapeScale),
    );
    launchShapeFromBottom(sim, floorY);
  }

  if (floatShape) {
    applySlotSimulationMargin(
      slot,
      sim,
      cssHeight,
      backgroundShapeScale,
      physicsMode,
      restFloorFactorRange,
      false,
    );
  }

  applySlotDisplayRotation(sim, slot.rotation);
  return sim;
}

function setupHiDpiCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  return dpr;
}

function distanceToGrabbed(sim: SpringsSimulation, x: number, y: number) {
  if (sim.grabbedIndex < 0) return Infinity;
  const particle = sim.particles[sim.grabbedIndex]!;
  return Math.hypot(x - particle.px, y - particle.py);
}

function findShapeAtPoint(
  shapes: readonly ShapeSlot[],
  x: number,
  y: number,
  pointerType: string,
) {
  const basePickRadius =
    pointerType === "touch" ? PARTICLE_PICK_RADIUS_TOUCH : PARTICLE_PICK_RADIUS;

  let closestId: string | null = null;
  let closestDist = Infinity;

  for (const slot of shapes) {
    if (!slot.sim) continue;

    const runtime = SHAPE_RUNTIMES[slot.shapeId];
    const pickRadius = basePickRadius * Math.max(0.9, slot.visualScale);
    const previousGrabbedIndex = slot.sim.grabbedIndex;
    runtime.pick(slot.sim, x, y, pickRadius);
    const dist = distanceToGrabbed(slot.sim, x, y);
    slot.sim.grabbedIndex = previousGrabbedIndex;

    if (dist < closestDist) {
      closestDist = dist;
      closestId = slot.id;
    }
  }

  if (!closestId || closestDist === Infinity) {
    return null;
  }

  return closestId;
}

type HomePageShapesBackgroundProps = {
  colorScheme?: ShapeColorsVariant;
  /** HSV multipliers applied on top of the active palette. */
  colorAdjust?: ShapeColorAdjust;
  /** Clamps every face fill between an opacity floor and ceiling. */
  drawAlphaRange?: ShapeDrawAlphaRange;
  /** Live overrides for spring edges and handle dots. */
  strokeStyle?: ShapeStrokeStyle;
  /** Live overrides for patterned texture base washes. */
  textureFillStyle?: ShapeTextureFillStyle;
  /** Forces a remount when the exploration preview switches variants. */
  previewKey?: string;
  config?: MultiShapeSpringsCanvasConfig;
  className?: string;
  componentId?: string;
  ariaLabel?: string;
};

function createRandomLayoutSeed() {
  return (Math.random() * 0x100000000) >>> 0;
}

/** 1-bit Macintosh reads Solid as a flat blob — keep only patterned fills. */
const MACINTOSH_PATTERN_TEXTURES = PROTO_TEXTURES.filter(
  (texture) => texture !== "Solid" && texture !== "Gradient",
);

function resolveMacintoshTextureId(
  textureId: ProtoTextureId,
  index: number,
): ProtoTextureId {
  if (textureId !== "Solid" && textureId !== "Gradient") return textureId;
  return MACINTOSH_PATTERN_TEXTURES[
    index % MACINTOSH_PATTERN_TEXTURES.length
  ]!;
}

export function HomePageShapesBackground({
  colorScheme = SHAPE_COLORS_BASELINE_SCHEME,
  colorAdjust,
  drawAlphaRange,
  strokeStyle,
  textureFillStyle,
  previewKey,
  config = HOME_PAGE_SHAPES_CONFIG,
  className = "absolute inset-0 z-10 overflow-hidden bg-transparent",
  componentId = "home-page-shapes-background",
  ariaLabel = "Interactive proto shapes background",
}: HomePageShapesBackgroundProps = {}) {
  const { resolvedTheme } = useTheme();
  const isMacintoshTheme = resolvedTheme === "macintosh";
  const activeColorScheme =
    resolvedTheme === "matrix" ||
    resolvedTheme === "p5js" ||
    isMacintoshTheme
      ? resolvedTheme
      : colorScheme;
  const activeColorAdjust = isMacintoshTheme
    ? undefined
    : resolvedTheme === "matrix" || resolvedTheme === "p5js"
      ? undefined
      : colorAdjust;
  const activeDrawAlphaRange = isMacintoshTheme
    ? { lower: 1, upper: 1 }
    : drawAlphaRange;
  const activeStrokeStyle = isMacintoshTheme
    ? {
        ...strokeStyle,
        borderThickness: 1.55,
        dotBorderThickness: 1.7,
        whiteBorders: false,
        blackBorders: true,
      }
    : strokeStyle;
  const activeTextureFillStyle = isMacintoshTheme
    ? {
        plainFillOpacity: 1,
        gradientFadeOpacity: 1,
      }
    : textureFillStyle;
  const colorValue = activeColorAdjust?.value ?? 1;
  const colorSaturation = activeColorAdjust?.saturation ?? 1;
  const isMobileViewport = useHomePageMobileViewport();
  const viewportPreviewKey = `${previewKey ?? "default"}-${isMobileViewport ? "mobile" : "desktop"}`;
  // Fresh layout each mount / preview switch. Fixed-slot callers keep config.seed.
  const [layoutEpoch, setLayoutEpoch] = useState(() => ({
    previewKey: viewportPreviewKey,
    seed: createRandomLayoutSeed(),
  }));
  if (layoutEpoch.previewKey !== viewportPreviewKey) {
    setLayoutEpoch({ previewKey: viewportPreviewKey, seed: createRandomLayoutSeed() });
  }
  const layoutSeed = layoutEpoch.seed;

  const layoutConfig = useMemo(() => {
    const base = config.fixedSlots?.length
      ? config
      : { ...config, seed: layoutSeed };
    if (base.fixedSlots?.length || !isMobileViewport) return base;
    const mobileShapeCount = base.mobileShapeCount ??
      Math.min(base.shapeCount, HOME_PAGE_MOBILE_SHAPE_COUNT);
    return {
      ...base,
      shapeCount: mobileShapeCount,
      gridCols: Math.min(base.gridCols, HOME_PAGE_MOBILE_GRID_COLS),
    };
  }, [config, isMobileViewport, layoutSeed]);

  const slotConfigs = useMemo(() => {
    const slots = generateShapeSlotConfigs(layoutConfig, activeColorScheme, {
      value: colorValue,
      saturation: colorSaturation,
    });
    if (!isMacintoshTheme) return slots;
    return slots.map((slot, index) => ({
      ...slot,
      textureId: resolveMacintoshTextureId(slot.textureId, index),
    }));
  }, [
    activeColorScheme,
    colorSaturation,
    colorValue,
    isMacintoshTheme,
    layoutConfig,
  ]);
  const drawAlphaRangeRef = useRef<ShapeDrawAlphaRange | undefined>(
    activeDrawAlphaRange,
  );
  drawAlphaRangeRef.current = activeDrawAlphaRange;
  const strokeStyleRef = useRef<ShapeStrokeStyle | undefined>(
    activeStrokeStyle,
  );
  strokeStyleRef.current = activeStrokeStyle;
  const textureFillStyleRef = useRef<ShapeTextureFillStyle | undefined>(
    activeTextureFillStyle,
  );
  textureFillStyleRef.current = activeTextureFillStyle;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragTooltipRef = useRef<HTMLDivElement>(null);
  const dragTooltipLabelRef = useRef<HTMLSpanElement>(null);
  const shapesRef = useRef<ShapeSlot[]>(
    slotConfigs.map((slotConfig) => ({
      ...slotConfig,
      sim: null,
    })),
  );

  useEffect(() => {
    shapesRef.current = slotConfigs.map((slotConfig) => {
      const existing = shapesRef.current.find(
        (slot) => slot.id === slotConfig.id,
      );
      const sim =
        existing?.sim &&
        existing.shapeId === slotConfig.shapeId &&
        existing.rotation === slotConfig.rotation &&
        existing.floatUntilInteraction === slotConfig.floatUntilInteraction
          ? existing.sim
          : null;
      return {
        ...slotConfig,
        sim,
        displayColor: existing?.displayColor ?? slotConfig.color,
        stillFrames: existing?.stillFrames,
        asleep: existing?.asleep,
        lastCx: existing?.lastCx,
        lastCy: existing?.lastCy,
        floatPinReady: existing?.floatPinReady,
        lastFloatCx: existing?.lastFloatCx,
        lastFloatCy: existing?.lastFloatCy,
        floatStillFrames: existing?.floatStillFrames,
      };
    });
  }, [slotConfigs]);
  const grabbedShapeIdRef = useRef<string | null>(null);
  const hoveredShapeIdRef = useRef<string | null>(null);
  const clickedShapeIdRef = useRef<string | null>(null);
  const releasedFloatShapeIdsRef = useRef<Set<string>>(new Set());
  const floatAnchorPosesRef = useRef<Map<string, FloatAnchor>>(new Map());
  const sizeRef = useRef<CanvasSize>({ cssWidth: 1, cssHeight: 1, dpr: 1 });
  const inputRef = useRef<PointerInput>({
    pointerX: 0,
    pointerY: 0,
    pointerDown: false,
  });
  const rafRef = useRef<number | null>(null);
  const configRef = useRef(config);
  const backgroundShapeScaleRef = useRef(config.backgroundShapeScale);
  configRef.current = config;

  useEffect(() => {
    releasedFloatShapeIdsRef.current = new Set();
    floatAnchorPosesRef.current = new Map();
  }, [config, viewportPreviewKey]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (resolveSharedStackPhysics(configRef.current)) {
      for (const slot of shapesRef.current) {
        slot.sim = null;
      }
    }

    const entranceStartedAtMs = performance.now();
    const pileUpStaggerOrder = new Map<string, number>();
    if (resolveSharedStackPhysics(configRef.current)) {
      const sortedSlots = [...shapesRef.current].sort(
        (a, b) => a.xFactor - b.xFactor,
      );
      let entranceSlots = sortedSlots;
      if (configRef.current.shapeEntranceOrder === "distributed") {
        entranceSlots = distributeEntranceSlots(sortedSlots);
      } else if (configRef.current.shapeEntranceOrder === "random") {
        entranceSlots = [...sortedSlots];
        shuffleWithRandom(
          entranceSlots,
          createSeededRandom(layoutSeed ^ 0x6d2b79f5),
        );
      }
      entranceSlots.forEach((slot, orderIndex) => {
        pileUpStaggerOrder.set(slot.id, orderIndex);
      });
    }

    const tryCreateSlotSimulation = (
      slot: ShapeSlot,
      slotIndex: number,
      cssWidth: number,
      cssHeight: number,
    ) => {
      if (slot.sim) return;

      const currentConfig = configRef.current;
      const physicsMode = currentConfig.physicsMode ?? "background";
      const staggerIndex = resolveSharedStackPhysics(currentConfig)
        ? (pileUpStaggerOrder.get(slot.id) ?? slotIndex)
        : slotIndex;

      if (slotUsesStaggeredEntrance(slot, currentConfig)) {
        const revealAt =
          entranceStartedAtMs +
          (currentConfig.shapeEntranceDelay ?? 0) * 1000 +
          staggerIndex * (currentConfig.shapeEntranceStagger ?? 0) * 1000 +
          (slot.entranceDelayExtra ?? 0) * 1000;
        if (performance.now() < revealAt) return;
      }

      if (isSlotFloating(slot, releasedFloatShapeIdsRef.current)) {
        const titleTopY = measureHomePageHeadlineTopY(container);
        if (titleTopY === null) return;

        slot.restFloorFactor = resolvePublishedShapeFloatRestFloorFactor(
          cssWidth,
          cssHeight,
          titleTopY,
          resolveShapeMargin(
            slot.shapeId,
            slot.visualScale,
            backgroundShapeScaleRef.current,
          ),
        );
      }

      slot.sim = createShapeSimulation(
        slot,
        cssWidth,
        cssHeight,
        backgroundShapeScaleRef.current,
        physicsMode,
        resolveSlotEntrance(slot, currentConfig),
        getSlotRestFloorFactorRange(shapesRef.current),
        resolveSlotUsesSharedStackPhysics(
          slot,
          currentConfig,
          releasedFloatShapeIdsRef.current,
        ),
      );
    };

    const resize = () => {
      const cssWidth = Math.max(1, Math.floor(container.clientWidth));
      const cssHeight = Math.max(1, Math.floor(container.clientHeight));
      const dpr = setupHiDpiCanvas(canvas, cssWidth, cssHeight);
      sizeRef.current = { cssWidth, cssHeight, dpr };
      const previousBackgroundShapeScale = backgroundShapeScaleRef.current;
      const backgroundShapeScale = resolveHomePageBackgroundShapeScale(
        cssWidth,
        configRef.current.backgroundShapeScale,
        configRef.current.responsiveShapeScale !== false,
      );
      backgroundShapeScaleRef.current = backgroundShapeScale;
      const physicsMode = configRef.current.physicsMode ?? "background";

      if (
        previousBackgroundShapeScale > 0 &&
        previousBackgroundShapeScale !== backgroundShapeScale
      ) {
        const scaleRatio = backgroundShapeScale / previousBackgroundShapeScale;
        for (const slot of shapesRef.current) {
          if (!slot.sim) continue;
          scaleSpringsSimulationAroundCentroid(slot.sim, scaleRatio);
        }
      }

      if (cssHeight < MIN_VALID_CANVAS_HEIGHT) {
        for (const slot of shapesRef.current) {
          slot.sim = null;
        }
        return;
      }

      const restFloorFactorRange = getSlotRestFloorFactorRange(
        shapesRef.current,
      );

      for (let index = 0; index < shapesRef.current.length; index += 1) {
        const slot = shapesRef.current[index]!;
        if (isSlotFloating(slot, releasedFloatShapeIdsRef.current)) {
          slot.restFloorFactor =
            resolvePublishedShapeFloatRestFloorFactorForSlot(
              container,
              cssWidth,
              cssHeight,
              slot,
              backgroundShapeScale,
            );
          slot.sim = null;
          slot.floatPinReady = false;
          slot.floatStillFrames = 0;
          slot.lastFloatCx = undefined;
          slot.lastFloatCy = undefined;
          floatAnchorPosesRef.current.delete(slot.id);
          continue;
        }

        if (slot.sim) {
          SHAPE_RUNTIMES[slot.shapeId].updateBounds(
            slot.sim,
            cssWidth,
            cssHeight,
          );
          applySlotSimulationMargin(
            slot,
            slot.sim,
            cssHeight,
            backgroundShapeScale,
            physicsMode,
            restFloorFactorRange,
            resolveSlotUsesSharedStackPhysics(
              slot,
              configRef.current,
              releasedFloatShapeIdsRef.current,
            ),
          );
        } else if (!slotUsesStaggeredEntrance(slot, configRef.current)) {
          slot.sim = createShapeSimulation(
            slot,
            cssWidth,
            cssHeight,
            backgroundShapeScale,
            physicsMode,
            resolveSlotEntrance(slot, configRef.current),
            restFloorFactorRange,
            resolveSlotUsesSharedStackPhysics(
              slot,
              configRef.current,
              releasedFloatShapeIdsRef.current,
            ),
          );
        }
      }
    };

    const layoutRoot = resolveHomePageLayoutRoot(container);
    const observer = new ResizeObserver(() => resize());
    observer.observe(container);
    const headline = layoutRoot.querySelector(HOME_PAGE_HEADLINE_SELECTOR);
    if (headline instanceof HTMLElement) {
      observer.observe(headline);
    }
    const copyBlock = layoutRoot.querySelector("#home-page-copy-block");
    if (copyBlock instanceof HTMLElement) {
      observer.observe(copyBlock);
    }
    resize();

    const pointerToCanvas = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return { x: 0, y: 0 };
      }
      const x = ((clientX - rect.left) / rect.width) * sizeRef.current.cssWidth;
      const y =
        ((clientY - rect.top) / rect.height) * sizeRef.current.cssHeight;
      return { x, y };
    };

    const cleanupPointer = bindSpringsCanvasPointerHandlers(canvas, {
      onPointerDown: (event) => {
        const shapes = shapesRef.current;
        const { x, y } = pointerToCanvas(event.clientX, event.clientY);
        const closestId = findShapeAtPoint(shapes, x, y, event.pointerType);

        if (configRef.current.showClickAttributionTooltip) {
          clickedShapeIdRef.current = closestId;
        }

        if (!closestId) {
          grabbedShapeIdRef.current = null;
          return false;
        }

        const winningSlot = shapes.find((slot) => slot.id === closestId);
        if (
          winningSlot &&
          isSlotFloating(winningSlot, releasedFloatShapeIdsRef.current)
        ) {
          releaseFloatingShape(
            winningSlot,
            sizeRef.current.cssHeight,
            backgroundShapeScaleRef.current,
            configRef.current,
            shapes,
            releasedFloatShapeIdsRef.current,
            floatAnchorPosesRef.current,
          );
        }

        if (winningSlot?.sim) {
          const pickRadius =
            event.pointerType === "touch"
              ? PARTICLE_PICK_RADIUS_TOUCH
              : PARTICLE_PICK_RADIUS;
          const scaledRadius =
            pickRadius * Math.max(0.9, winningSlot.visualScale);
          SHAPE_RUNTIMES[winningSlot.shapeId].pick(
            winningSlot.sim,
            x,
            y,
            scaledRadius,
          );
        }

        for (const slot of shapes) {
          if (!slot.sim) continue;
          if (slot.id === closestId) {
            slot.sim.clicked = true;
          } else {
            slot.sim.grabbedIndex = -1;
          }
        }

        grabbedShapeIdRef.current = closestId;
        inputRef.current.pointerX = x;
        inputRef.current.pointerY = y;
        inputRef.current.pointerDown = true;
        return true;
      },
      onPointerMove: (event) => {
        const { x, y } = pointerToCanvas(event.clientX, event.clientY);
        inputRef.current.pointerX = x;
        inputRef.current.pointerY = y;
        if (configRef.current.showHoverAttributionTooltip) {
          hoveredShapeIdRef.current = event.pointerType === "touch"
            ? null
            : findShapeAtPoint(shapesRef.current, x, y, event.pointerType);
        }
      },
      onPointerEnd: () => {
        inputRef.current.pointerDown = false;
        grabbedShapeIdRef.current = null;
        for (const slot of shapesRef.current) {
          if (slot.sim) slot.sim.grabbedIndex = -1;
        }
      },
    });

    // Drag handlers receive moves only after pointerdown. Hover needs its own
    // listener so the attribution can appear before any selection or drag.
    const onHoverPointerMove = (event: PointerEvent) => {
      if (!configRef.current.showHoverAttributionTooltip) return;
      const { x, y } = pointerToCanvas(event.clientX, event.clientY);
      hoveredShapeIdRef.current = event.pointerType === "touch"
        ? null
        : findShapeAtPoint(shapesRef.current, x, y, event.pointerType);
    };
    canvas.addEventListener("pointermove", onHoverPointerMove);

    const frame = () => {
      const shapes = shapesRef.current;
      const { cssWidth, cssHeight, dpr } = sizeRef.current;
      const grabbedId = grabbedShapeIdRef.current;
      const backgroundShapeScale = backgroundShapeScaleRef.current;
      const physicsMode = configRef.current.physicsMode ?? "background";

      if (cssHeight >= MIN_VALID_CANVAS_HEIGHT) {
        for (let index = 0; index < shapes.length; index += 1) {
          tryCreateSlotSimulation(shapes[index]!, index, cssWidth, cssHeight);
        }
      }

      const sharedStackPhysics = resolveSharedStackPhysics(configRef.current);
      const releasedFloatShapeIds = releasedFloatShapeIdsRef.current;
      const floatAnchorPoses = floatAnchorPosesRef.current;

      if (sharedStackPhysics) {
        for (const slot of shapes) {
          if (!slot.sim) continue;
          if (isSlotFloating(slot, releasedFloatShapeIds)) continue;
          slot.sim.floorInset = undefined;
        }
      }

      for (const slot of shapes) {
        if (!slot.sim) continue;

        const isGrabbed = grabbedId === slot.id && inputRef.current.pointerDown;
        if (isGrabbed && slot.asleep) {
          slot.asleep = false;
          slot.stillFrames = 0;
        }

        if (
          isSlotFloating(slot, releasedFloatShapeIds) &&
          slot.floatPinReady
        ) {
          const anchor = floatAnchorPoses.get(slot.id);
          if (anchor) {
            applyFloatAnchor(slot.sim, anchor);
          }
          continue;
        }

        // Frozen settled shapes skip integration entirely so they can't shiver.
        if (
          sharedStackPhysics &&
          slot.asleep &&
          !isSlotFloating(slot, releasedFloatShapeIds)
        ) {
          continue;
        }

        SHAPE_RUNTIMES[slot.shapeId].step(slot.sim, {
          ...inputRef.current,
          pointerDown: isGrabbed,
        });

        if (
          isSlotFloating(slot, releasedFloatShapeIds) &&
          !slot.floatPinReady
        ) {
          const centroid = getSimulationCentroid(slot.sim);
          const moved =
            slot.lastFloatCx === undefined
              ? Infinity
              : Math.hypot(
                  centroid.x - slot.lastFloatCx,
                  centroid.y - slot.lastFloatCy!,
                );
          slot.lastFloatCx = centroid.x;
          slot.lastFloatCy = centroid.y;

          if (isGrabbed || moved >= STACK_SLEEP_MOVE) {
            slot.floatStillFrames = 0;
          } else {
            slot.floatStillFrames = (slot.floatStillFrames ?? 0) + 1;
            const expandedHeight = getSimulationVerticalBounds(slot.sim).height;
            const pinMinHeight = resolveFloatPinMinExpandedHeight(
              slot,
              backgroundShapeScale,
            );
            if (
              slot.floatStillFrames >= STACK_SLEEP_FRAMES &&
              expandedHeight >= pinMinHeight
            ) {
              slot.floatPinReady = true;
              captureFloatingShapeAnchor(slot, floatAnchorPoses);
            }
          }
        }
      }

      if (sharedStackPhysics) {
        const particleGroups: CollidableParticle[][] = [];
        const faceSets: ShapeFaceSet[] = [];
        const pinnedParticles: CollidableParticle[] = [];
        const sleeping: boolean[] = [];
        const activeSlots: ShapeSlot[] = [];

        for (const slot of shapes) {
          if (!slot.sim) continue;
          if (isSlotFloating(slot, releasedFloatShapeIds)) continue;
          activeSlots.push(slot);
          particleGroups.push(slot.sim.particles);
          faceSets.push(SHAPE_RUNTIMES[slot.shapeId].collisionFaces);
          sleeping.push(slot.asleep ?? false);
          if (
            grabbedId === slot.id &&
            inputRef.current.pointerDown &&
            slot.sim.grabbedIndex > -1
          ) {
            pinnedParticles.push(slot.sim.particles[slot.sim.grabbedIndex]!);
          }
        }

        resolveInterShapeFaceCollisions(
          particleGroups,
          faceSets,
          pinnedParticles,
          sleeping,
          (groupIndex) => {
            const woken = activeSlots[groupIndex];
            if (woken) {
              woken.asleep = false;
              woken.stillFrames = 0;
            }
          },
        );

        for (const slot of activeSlots) {
          if (!slot.sim || slot.asleep) continue;

          const centroid = getSimulationCentroid(slot.sim);
          const isGrabbed =
            grabbedId === slot.id && inputRef.current.pointerDown;
          const moved =
            slot.lastCx === undefined
              ? Infinity
              : Math.hypot(centroid.x - slot.lastCx, centroid.y - slot.lastCy!);
          slot.lastCx = centroid.x;
          slot.lastCy = centroid.y;

          // Reset the timer whenever the shape moves meaningfully or is grabbed;
          // slow creep and in-place bounce below the threshold settle to sleep.
          if (isGrabbed || moved >= STACK_SLEEP_MOVE) {
            slot.stillFrames = 0;
            continue;
          }

          slot.stillFrames = (slot.stillFrames ?? 0) + 1;
          if (slot.stillFrames >= STACK_SLEEP_FRAMES) {
            slot.asleep = true;
            for (const particle of slot.sim.particles) {
              particle.vx = 0;
              particle.vy = 0;
            }
          }
        }

        for (const slot of shapes) {
          if (slot.shapeId !== "square" || !slot.sim) continue;
          const squarePinned =
            grabbedId === slot.id &&
            inputRef.current.pointerDown &&
            slot.sim.grabbedIndex > -1
              ? [slot.sim.particles[slot.sim.grabbedIndex]!]
              : [];
          resolveSelfCollisions(
            slot.sim.particles,
            {
              particles: slot.sim.particles,
              edges: SQUARE_COLLISION_EDGES,
            },
            SQUARE_SPRING_PAIRS,
            squarePinned,
          );
        }
      } else if (physicsMode === "background") {
        for (const slot of shapes) {
          if (!slot.sim) continue;

          const isGrabbed =
            grabbedId === slot.id && inputRef.current.pointerDown;
          const margin = resolveShapeMargin(
            slot.shapeId,
            slot.visualScale,
            backgroundShapeScale,
          );
          const floorY = getRestFloorY(cssHeight, slot.restFloorFactor, margin);
          const pinned: CollidableParticle[] =
            isGrabbed && slot.sim.grabbedIndex > -1
              ? [slot.sim.particles[slot.sim.grabbedIndex]!]
              : [];

          if (slot.shapeId !== "square") {
            enforceShapeFloor(slot.sim, floorY, pinned);
          }
        }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      const drawOrder = [...shapes].sort((a, b) => {
        const aGrabbed = grabbedId === a.id;
        const bGrabbed = grabbedId === b.id;
        if (aGrabbed !== bGrabbed) return aGrabbed ? 1 : -1;
        const aFloating = isSlotFloating(a, releasedFloatShapeIds);
        const bFloating = isSlotFloating(b, releasedFloatShapeIds);
        if (aFloating !== bFloating) return aFloating ? 1 : -1;
        if (sharedStackPhysics) {
          if (!a.sim || !b.sim) return 0;
          return (
            getShapeStackDepth(a.sim.particles) -
            getShapeStackDepth(b.sim.particles)
          );
        }
        return a.restFloorFactor - b.restFloorFactor;
      });

      const liveBackground = getPageBackgroundRgb(canvas);
      const currentStrokeStyle = {
        ...strokeStyleRef.current,
        dotFillBackground:
          strokeStyleRef.current?.dotFillBackground ?? liveBackground,
      };

      for (const slot of drawOrder) {
        if (!slot.sim) continue;
        const runtime = SHAPE_RUNTIMES[slot.shapeId];
        const { dotScale, renderScale } = getSlotLayout(
          slot.shapeId,
          slot.visualScale,
          backgroundShapeScale,
        );
        const currentConfig = configRef.current;
        if (currentConfig.depthGradient) {
          const depthT = getShapeShelfDepthT(
            slot.restFloorFactor,
            currentConfig.minRestFloorFactor,
            currentConfig.maxRestFloorFactor,
          );
          ctx.globalAlpha = getDepthDrawAlpha(depthT, {
            lower: DEPTH_TOP_DRAW_ALPHA,
            upper: 1,
          });
        }
        if (!slot.displayColor) slot.displayColor = slot.color;
        if (reduceMotion || rgbNearEqual(slot.displayColor, slot.color)) {
          slot.displayColor = slot.color;
        } else {
          slot.displayColor = lerpRgb(
            slot.displayColor,
            slot.color,
            COLOR_TRANSITION_SPEED,
          );
        }

        runtime.draw(
          ctx,
          slot.sim,
          slot.displayColor,
          slot.textureId,
          dotScale,
          renderScale,
          drawAlphaRangeRef.current,
          currentStrokeStyle,
          textureFillStyleRef.current,
        );
        ctx.globalAlpha = 1;
      }

      if (configRef.current.showDragAttributionTooltip || configRef.current.showHoverAttributionTooltip || configRef.current.showClickAttributionTooltip) {
        const tooltipShapeId = configRef.current.showClickAttributionTooltip
          ? clickedShapeIdRef.current
          : inputRef.current.pointerDown && grabbedId
            ? grabbedId
            : configRef.current.showHoverAttributionTooltip ? hoveredShapeIdRef.current : null;

        updateShapeAttributionTooltip(
          dragTooltipRef.current,
          dragTooltipLabelRef.current,
          shapes,
          tooltipShapeId,
          configRef.current.dragAttributionLabel,
          containerRef.current,
          backgroundShapeScale,
          false,
        );
      } else if (dragTooltipRef.current) {
        dragTooltipRef.current.style.display = "none";
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      observer.disconnect();
      cleanupPointer();
      canvas.removeEventListener("pointermove", onHoverPointerMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [viewportPreviewKey, layoutConfig.shapeCount]);

  return (
    <PrototypeComponent id={componentId} className={className}>
      <div
        key={viewportPreviewKey}
        ref={containerRef}
        className="absolute inset-0 min-h-0 min-w-0 touch-none"
        aria-label={ariaLabel}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block touch-none select-none"
        />
        {config.showDragAttributionTooltip || config.showHoverAttributionTooltip || config.showClickAttributionTooltip ? (
          <DragAttributionTooltipLayer
            tooltipRef={dragTooltipRef}
            labelRef={dragTooltipLabelRef}
          />
        ) : null}
      </div>
    </PrototypeComponent>
  );
}
