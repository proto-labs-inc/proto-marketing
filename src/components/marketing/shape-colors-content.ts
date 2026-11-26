import {
  PROTO_COLORS,
  type ProtoColorId,
  type ProtoRgb,
} from "@/lib/marketing/shapes/proto-shape-content";

export type ShapeColorsVariant =
  | "electric-deep"
  | "electric-pop"
  | "google-brand"
  | "google-classic"
  | "material-500"
  | "material-700"
  | "google-deep"
  | "studio-pigment"
  | "deep-jewel"
  | "soft-ceramic"
  | "atlantic-ink"
  | "warm-signal"
  | "mineral-matte"
  | "tropical-punch"
  | "hyper-citrus"
  | "ultra-jewel"
  | "muted-jewel"
  | "earth-clay"
  | "ink-slate"
  | "editorial-pop"
  | "soft-mist"
  | "neon-bright"
  | "matrix"
  | "p5js"
  | "macintosh";

/** Pre-exploration palette — original proto-shapes colors. */
export const SHAPE_COLORS_BASELINE_SCHEME: ShapeColorsVariant = "neon-bright";

export const DEFAULT_SHAPE_COLORS_VARIANT: ShapeColorsVariant = "electric-pop";

/** Electric pop vs a slightly deeper take. */
export const SHAPE_COLOR_PICKER_OPTIONS: Array<{
  value: ShapeColorsVariant;
  label: string;
  hint: string;
}> = [
  {
    value: "electric-pop",
    label: "Electric pop",
    hint: "Original",
  },
  {
    value: "electric-deep",
    label: "Electric deep",
    hint: "Electric pop, one step deeper",
  },
];

export type ShapeColorAdjust = {
  /** Multiplier on HSV value / brightness. 1 = unchanged. */
  value: number;
  /** Multiplier on HSV saturation. 1 = unchanged. */
  saturation: number;
};

export type ShapeDrawAlphaRange = {
  /** Face opacity floor — at 1 no face is see-through. */
  lower: number;
  /** Face opacity ceiling — at 0 every face is fully see-through. */
  upper: number;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function rgbToHsv(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToRgb(h: number, s: number, v: number): ProtoRgb {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let rn = 0;
  let gn = 0;
  let bn = 0;
  switch (i % 6) {
    case 0:
      rn = v;
      gn = t;
      bn = p;
      break;
    case 1:
      rn = q;
      gn = v;
      bn = p;
      break;
    case 2:
      rn = p;
      gn = v;
      bn = t;
      break;
    case 3:
      rn = p;
      gn = q;
      bn = v;
      break;
    case 4:
      rn = t;
      gn = p;
      bn = v;
      break;
    default:
      rn = v;
      gn = p;
      bn = q;
      break;
  }
  return [
    Math.round(clamp01(rn) * 255),
    Math.round(clamp01(gn) * 255),
    Math.round(clamp01(bn) * 255),
  ];
}

/** Scale HSV saturation / value on a proto RGB color. */
export function adjustShapeColor(
  color: ProtoRgb,
  adjust?: ShapeColorAdjust,
): ProtoRgb {
  if (!adjust) return color;
  if (adjust.value === 1 && adjust.saturation === 1) return color;
  const [h, s, v] = rgbToHsv(color[0], color[1], color[2]);
  return hsvToRgb(h, clamp01(s * adjust.saturation), clamp01(v * adjust.value));
}

/** Pre-exploration palette — original proto-shapes colors. */
const NEON_BRIGHT_COLORS: Record<ProtoColorId, ProtoRgb> = {
  green: [43, 220, 120],
  purple: [110, 16, 250],
  teal: [40, 200, 200],
  pink: [255, 95, 155],
  gold: [255, 200, 50],
};

export const SHAPE_COLOR_PALETTES: Record<
  ShapeColorsVariant,
  Record<ProtoColorId, ProtoRgb>
> = {
  /** Electric pop with lightness pulled down — same hues, less neon. */
  "electric-deep": {
    green: [10, 178, 98],
    purple: [104, 36, 214],
    teal: [12, 162, 188],
    pink: [220, 40, 118],
    gold: [224, 164, 28],
  },
  /** Google logo: green / blue / red / yellow + Material purple for the 5th slot. */
  "google-brand": {
    green: [52, 168, 83], // #34A853
    purple: [156, 39, 176], // Material Purple 500
    teal: [66, 133, 244], // #4285F4
    pink: [234, 67, 53], // #EA4335
    gold: [251, 188, 4], // #FBBC04
  },
  /** Older Google Play brand book greens/reds/yellow. */
  "google-classic": {
    green: [15, 157, 88], // #0F9D58
    purple: [123, 31, 162], // Material Purple 700
    teal: [66, 133, 244], // #4285F4
    pink: [219, 68, 55], // #DB4437
    gold: [244, 180, 0], // #F4B400
  },
  /** Material Design 500 primaries. */
  "material-500": {
    green: [76, 175, 80], // #4CAF50
    purple: [156, 39, 176], // #9C27B0
    teal: [33, 150, 243], // #2196F3
    pink: [233, 30, 99], // #E91E63
    gold: [255, 193, 7], // #FFC107
  },
  /** Material Design 700 — deeper, still saturated. */
  "material-700": {
    green: [56, 142, 60], // #388E3C
    purple: [123, 31, 162], // #7B1FA2
    teal: [25, 118, 210], // #1976D2
    pink: [194, 24, 91], // #C2185B
    gold: [255, 160, 0], // #FFA000
  },
  /** Google brand hues darkened ~one step without going muddy. */
  "google-deep": {
    green: [30, 142, 62],
    purple: [122, 28, 150],
    teal: [36, 99, 235],
    pink: [200, 42, 36],
    gold: [230, 162, 0],
  },
  "studio-pigment": {
    green: [46, 158, 108],
    purple: [96, 72, 168],
    teal: [48, 140, 164],
    pink: [188, 84, 116],
    gold: [188, 144, 56],
  },
  "deep-jewel": {
    green: [28, 140, 104],
    purple: [88, 52, 160],
    teal: [32, 132, 156],
    pink: [176, 56, 100],
    gold: [180, 132, 40],
  },
  "soft-ceramic": {
    green: [78, 136, 108],
    purple: [112, 88, 144],
    teal: [76, 128, 140],
    pink: [172, 104, 116],
    gold: [172, 136, 76],
  },
  "atlantic-ink": {
    green: [44, 128, 112],
    purple: [80, 72, 136],
    teal: [52, 116, 144],
    pink: [152, 76, 104],
    gold: [160, 128, 60],
  },
  "warm-signal": {
    green: [56, 148, 96],
    purple: [108, 64, 148],
    teal: [44, 148, 168],
    pink: [192, 72, 108],
    gold: [200, 148, 48],
  },
  "mineral-matte": {
    green: [64, 124, 96],
    purple: [96, 80, 132],
    teal: [60, 116, 132],
    pink: [156, 92, 108],
    gold: [156, 124, 64],
  },
  "neon-bright": NEON_BRIGHT_COLORS,
  "electric-pop": {
    green: [12, 214, 118],
    purple: [122, 48, 244],
    teal: [16, 196, 226],
    pink: [252, 56, 140],
    gold: [252, 192, 40],
  },
  /** Phosphor terminal: only Matrix greens, no pale or white fills. */
  matrix: {
    green: [0, 255, 65],
    purple: [0, 200, 50],
    teal: [20, 230, 80],
    pink: [0, 160, 42],
    gold: [0, 110, 28],
  },
  /** p5.js: one hot pink, brightness from full dye to light candy. */
  p5js: {
    green: [255, 0, 123],
    purple: [255, 148, 200],
    teal: [255, 115, 182],
    pink: [255, 46, 147],
    gold: [255, 82, 165],
  },
  /** System 6/7 1-bit: only black and white, no true gray. */
  macintosh: {
    green: [0, 0, 0],
    purple: [255, 255, 255],
    teal: [0, 0, 0],
    pink: [255, 255, 255],
    gold: [0, 0, 0],
  },
  "tropical-punch": {
    green: [30, 215, 130],
    purple: [190, 70, 245],
    teal: [20, 210, 195],
    pink: [255, 90, 105],
    gold: [255, 165, 40],
  },
  "hyper-citrus": {
    green: [130, 230, 40],
    purple: [180, 60, 250],
    teal: [40, 210, 190],
    pink: [255, 70, 120],
    gold: [255, 190, 30],
  },
  "ultra-jewel": {
    green: [0, 195, 130],
    purple: [110, 40, 230],
    teal: [0, 175, 205],
    pink: [225, 45, 110],
    gold: [240, 175, 35],
  },
  "muted-jewel": {
    green: [62, 118, 92],
    purple: [98, 78, 132],
    teal: [58, 108, 118],
    pink: [152, 98, 108],
    gold: [152, 118, 72],
  },
  "earth-clay": {
    green: [88, 108, 72],
    purple: [120, 88, 92],
    teal: [108, 120, 108],
    pink: [168, 112, 88],
    gold: [148, 120, 72],
  },
  "ink-slate": {
    green: [68, 92, 88],
    purple: [72, 68, 112],
    teal: [72, 92, 108],
    pink: [112, 88, 96],
    gold: [108, 96, 72],
  },
  "editorial-pop": {
    green: [28, 148, 88],
    purple: [88, 48, 168],
    teal: [24, 132, 148],
    pink: [168, 48, 88],
    gold: [168, 112, 32],
  },
  "soft-mist": {
    green: [128, 148, 132],
    purple: [132, 124, 148],
    teal: [124, 140, 148],
    pink: [148, 128, 132],
    gold: [148, 136, 112],
  },
};

function formatPaletteLabel(id: ShapeColorsVariant): string {
  if (id === "p5js") return "p5.js";
  if (id === "macintosh") return "Macintosh";
  const fromPicker = SHAPE_COLOR_PICKER_OPTIONS.find(
    (option) => option.value === id,
  );
  if (fromPicker) return fromPicker.label;
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getHomeShapePaletteColor(
  colorId: ProtoColorId,
  scheme: ShapeColorsVariant,
  adjust?: ShapeColorAdjust,
): ProtoRgb {
  return adjustShapeColor(SHAPE_COLOR_PALETTES[scheme][colorId], adjust);
}

export const SHAPE_COLORS_CONTEXT = {
  palettes: (Object.keys(SHAPE_COLOR_PALETTES) as ShapeColorsVariant[]).map(
    (id) => ({
      id,
      label: formatPaletteLabel(id),
      colors: PROTO_COLORS.map((color) => ({
        id: color.id,
        label: color.label,
        rgb: SHAPE_COLOR_PALETTES[id][color.id],
      })),
    }),
  ),
};
