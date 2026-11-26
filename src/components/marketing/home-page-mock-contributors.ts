import {
  PROTO_COLORS,
  PROTO_SHAPES,
  type ProtoColorId,
  type ProtoShapeId,
  type ProtoTextureId,
} from "@/lib/marketing/shapes/proto-shape-content";
import { PROTO_TEXTURES } from "@/lib/marketing/shapes/shape-textures";
import type { HomePageContributorShape } from "./home-page-contributor-shapes";

function shapeConfigKey(
  shapeId: ProtoShapeId,
  colorId: ProtoColorId,
  textureId: ProtoTextureId,
) {
  return `${shapeId}:${colorId}:${textureId}`;
}

export type MockContributor = {
  name: string;
  shapeId: ProtoShapeId;
  colorId: ProtoColorId;
  textureId: ProtoTextureId;
};

const MOCK_CREATOR_NAMES = [
  "Jordan",
  "Riley",
  "Sam",
  "Alex",
  "Morgan",
  "Casey",
  "Drew",
  "Kai",
  "Noah",
  "Sage",
  "Quinn",
  "Avery",
  "Blair",
  "Cameron",
  "Devon",
  "Ellis",
  "Finley",
  "Harper",
  "Jesse",
  "Luna",
  "Nico",
  "Parker",
  "Reese",
  "Taylor",
  "Wren",
  "Yuki",
  "Zara",
  "Iris",
  "Marco",
  "Ada",
  "Leo",
  "Maya",
  "Oscar",
  "Priya",
  "Remy",
  "Sasha",
  "Theo",
  "Vera",
  "Calvin",
  "Eden",
  "Flynn",
  "Greta",
  "Hudson",
  "Indie",
  "Jules",
  "Kit",
  "Lane",
  "Milan",
  "Nova",
  "Orion",
  "Phoenix",
  "River",
  "Sky",
  "Tatum",
  "Uma",
  "Vale",
  "Winter",
  "Xander",
  "Yara",
  "Zion",
  "Arlo",
  "Briar",
  "Cleo",
  "Dallas",
  "Emery",
  "Frankie",
  "Gray",
  "Haven",
  "Imani",
  "Joey",
  "Kendall",
  "Lennox",
  "Micah",
  "Naomi",
  "Oakley",
  "Peyton",
  "Rowan",
  "Shiloh",
  "Toby",
  "Uri",
  "Viv",
  "West",
  "Ximena",
  "Yael",
  "Zola",
  "Aspen",
  "Brooks",
  "Cruz",
  "Dakota",
  "Ember",
] as const;

function buildMockContributorCatalog(): MockContributor[] {
  const shapeIds = PROTO_SHAPES.map((shape) => shape.id);
  const colorIds = PROTO_COLORS.map((color) => color.id);
  const textureIds = [...PROTO_TEXTURES];
  const combos: Array<{
    shapeId: ProtoShapeId;
    colorId: ProtoColorId;
    textureId: ProtoTextureId;
  }> = [];

  for (const shapeId of shapeIds) {
    for (const colorId of colorIds) {
      for (const textureId of textureIds) {
        combos.push({ shapeId, colorId, textureId });
      }
    }
  }

  return MOCK_CREATOR_NAMES.map((name, index) => {
    const combo = combos[index % combos.length]!;
    return {
      name,
      shapeId: combo.shapeId,
      colorId: combo.colorId,
      textureId: combo.textureId,
    };
  });
}

export const HOME_PAGE_MOCK_CONTRIBUTORS: MockContributor[] =
  buildMockContributorCatalog();

export function getAvailableMockContributors(
  dbShapes: HomePageContributorShape[],
  catalog: readonly MockContributor[] = HOME_PAGE_MOCK_CONTRIBUTORS,
) {
  const reservedNames = new Set(dbShapes.map((shape) => shape.contributorName));
  const reservedConfigs = new Set(
    dbShapes.map((shape) =>
      shapeConfigKey(shape.shapeId, shape.colorId, shape.textureId),
    ),
  );

  return catalog.filter(
    (mock) =>
      !reservedNames.has(mock.name) &&
      !reservedConfigs.has(
        shapeConfigKey(mock.shapeId, mock.colorId, mock.textureId),
      ),
  );
}

function shuffleInPlace<T>(items: T[], random: () => number) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex]!, items[index]!];
  }
}

export function sampleMockContributors(
  count: number,
  random: () => number,
  dbShapes: HomePageContributorShape[] = [],
  excludeShapeIds: readonly ProtoShapeId[] = [],
) {
  const excludedShapeIds = new Set(excludeShapeIds);
  const available = getAvailableMockContributors(dbShapes).filter(
    (mock) => !excludedShapeIds.has(mock.shapeId),
  );
  shuffleInPlace(available, random);
  return available.slice(0, count);
}

export function mockContributorToHomePageShape(
  mock: MockContributor,
  random: () => number,
): HomePageContributorShape {
  return {
    id: `mock-${mock.name.toLowerCase()}-${mock.shapeId}-${mock.colorId}-${mock.textureId}`,
    contributorName: mock.name,
    shapeId: mock.shapeId,
    colorId: mock.colorId,
    textureId: mock.textureId,
    visualScale: 1 + random() * 0.35,
    restFloorFactor: 0.08 + random() * 0.92,
    xFactor: 0.02 + random() * 0.96,
    yFactor: 0.02 + random() * 0.96,
  };
}
