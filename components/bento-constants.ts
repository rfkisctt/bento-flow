export const THEME = {
  black: "#0a0a0a",
  gray: "#1e1e1e",
  grayLight: "#2a2a2a",
  gridLine: "#1a1a1a",
  maroon: "#990000",
  textMain: "#ffffff",
  textMuted: "#888888",
};

export const LIQUID_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.8,
};

export const RUBBER_BAND_SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.5,
};

export const MORPH_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
  mass: 1,
};

export const GOOEY_SPRING = {
  type: "spring" as const,
  stiffness: 150,
  damping: 15,
  mass: 0.5,
};

export const ELASTIC_SPRING = {
  type: "spring" as const,
  stiffness: 350,
  damping: 20,
  mass: 0.8,
  bounce: 0.4,
};

export interface GridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

export interface GridSettings {
  cellSize: number;
  gap: number;
  borderRadius: number;
  columns: number;
  rows: number;
}

export const CELL_UNIT = 50;

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const checkOverlap = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean => {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  );
};

export const findValidPosition = (
  item: GridItem,
  items: GridItem[],
  maxCols: number,
  maxRows: number
): { x: number; y: number } | null => {
  const otherItems = items.filter((i) => i.id !== item.id);

  const isWithinBounds =
    item.x >= 0 &&
    item.y >= 0 &&
    item.x + item.width <= maxCols &&
    item.y + item.height <= maxRows;

  const hasOverlap = otherItems.some((other) => checkOverlap(item, other));

  if (isWithinBounds && !hasOverlap) {
    return { x: item.x, y: item.y };
  }

  for (let y = 0; y <= maxRows - item.height; y++) {
    for (let x = 0; x <= maxCols - item.width; x++) {
      const testItem = { ...item, x, y };
      const isValid = !otherItems.some((other) =>
        checkOverlap(testItem, other)
      );
      if (isValid) {
        return { x, y };
      }
    }
  }

  return null;
};
