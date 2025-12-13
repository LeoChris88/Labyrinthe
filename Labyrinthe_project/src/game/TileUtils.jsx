import { TILE_TYPES } from "./TileTypes";

export const parseTile = (value) => {
  if (!value.includes(":")) {
    return { type: value };
  }
  const [type, data] = value.split(":");
  return { type, data };
};

export const getTileClass = (value, isPlayerHere) => {
  if (isPlayerHere) return "tile-player";
  if (value === TILE_TYPES.START) return "tile-start";
  if (value === TILE_TYPES.END) return "tile-end";
  if (value === TILE_TYPES.WALL) return "tile-wall";
  if (value.startsWith("M:")) return "tile-monster";
  if (value.startsWith("O:")) return "tile-obstacle";
  if (value.startsWith("D:")) return "tile-door";
  if (value.startsWith("K:")) return "tile-key";
  if (value.startsWith("I:")) return "tile-item";
  return "tile-default";
};