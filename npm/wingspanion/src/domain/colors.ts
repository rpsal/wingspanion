export type PlayerColorId =
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "black"
  | "white";

export const PLAYER_COLORS: Record<PlayerColorId, string> = {
  blue: "#2c6bed",
  red: "#c0392b",
  green: "#27ae60",
  yellow: "#f1c40f",
  purple: "#8e44ad",
  black: "#2d3436",
  white: "#bdc3c7",
};

export const PLAYER_COLOR_IDS: PlayerColorId[] = Object.keys(PLAYER_COLORS) as PlayerColorId[];