export type ProtoShapeId =
  | "triangle"
  | "cube"
  | "pentagon"
  | "prism"
  | "square";

export type ProtoColorId = "green" | "purple" | "teal" | "pink" | "gold";

export type ProtoRgb = [number, number, number];

export { PROTO_TEXTURES, type ProtoTextureId } from "./shape-textures";

export type ProtoShapeOption = {
  id: ProtoShapeId;
  label: string;
};

export type ProtoColorOption = {
  id: ProtoColorId;
  label: string;
  rgb: ProtoRgb;
};

/** Five shapes from the proto-shapes prototype. Cube sits in the center slot. */
export const PROTO_SHAPES: ProtoShapeOption[] = [
  { id: "triangle", label: "Triangle" },
  { id: "pentagon", label: "Pentagon" },
  { id: "cube", label: "Cube" },
  { id: "square", label: "Square" },
  { id: "prism", label: "Prism" },
];

/** Five colors — electric pop palette (home-page shape-colors exploration). */
export const PROTO_COLORS: ProtoColorOption[] = [
  { id: "green", label: "Green", rgb: [12, 214, 118] },
  { id: "purple", label: "Purple", rgb: [122, 48, 244] },
  { id: "teal", label: "Teal", rgb: [16, 196, 226] },
  { id: "pink", label: "Pink", rgb: [252, 56, 140] },
  { id: "gold", label: "Gold", rgb: [252, 192, 40] },
];

export function getProtoColor(id: ProtoColorId): ProtoColorOption {
  return PROTO_COLORS.find((color) => color.id === id) ?? PROTO_COLORS[0]!;
}
