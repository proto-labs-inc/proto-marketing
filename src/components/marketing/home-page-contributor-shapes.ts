import {
  getProtoColor,
  type ProtoColorId,
  type ProtoRgb,
  type ProtoShapeId,
  type ProtoTextureId,
} from "@/lib/marketing/shapes/proto-shape-content";

export type HomePageContributorShape = {
  id: string;
  contributorName: string;
  shapeId: ProtoShapeId;
  colorId: ProtoColorId;
  textureId: ProtoTextureId;
  visualScale: number;
  restFloorFactor: number;
  xFactor: number;
  yFactor: number;
};

/** Real partner shapes loaded from Supabase at runtime. */
export const HOME_PAGE_CONTRIBUTOR_SHAPES: HomePageContributorShape[] = [];

export function contributorShapeToSlotConfig(
  shape: HomePageContributorShape,
): {
  id: string;
  shapeId: ProtoShapeId;
  color: ProtoRgb;
  textureId: ProtoTextureId;
  visualScale: number;
  restFloorFactor: number;
  xFactor: number;
  yFactor: number;
  attributionLabel: string;
} {
  return {
    id: shape.id,
    shapeId: shape.shapeId,
    color: getProtoColor(shape.colorId).rgb,
    textureId: shape.textureId,
    visualScale: shape.visualScale,
    restFloorFactor: shape.restFloorFactor,
    xFactor: shape.xFactor,
    yFactor: shape.yFactor,
    attributionLabel: shape.contributorName,
  };
}
