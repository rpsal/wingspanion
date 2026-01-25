import type { CategoryId } from "./scoringCategories";
import type { AvatarId } from "../domain/avatars";
import type { PlayerColorId } from "./colors";
import type { Placement, EndOfRoundPlacements } from "../domain/endOfRoundScoring";

export type ExpansionId =
  | "base"
  | "europe"
  | "oceania"
  | "asia"
  | "americas"
  | "fanPack1";

export type EndOfRoundGoalMode = 
  | "green"
  | "blue"

// Player and App Models

export type PlayerProfile = {
  id: string;
  name: string;
  colorId: PlayerColorId;
  avatarId: AvatarId;
};

export type AppSettings = {
  // reserved for future settings
};

export type PlayerSnapshot = {
  id: string;
  name: string;
  colorId: PlayerColorId;
  avatarId: AvatarId;
};

// Scoring Models

export type NumericScore = {
  type: "numeric";
  value: number;
};

export type EndOfRoundScore = {
  type: "endOfRound";
  placements: Placement[];
};

export type ScoreValue =
  | NumericScore
  | EndOfRoundScore;

export type PlayerScores = {
  [categoryId in CategoryId]?: ScoreValue;
};

// Game Models

export type InProgressGame = {
  id: string;
  players: PlayerSnapshot[];
  expansions: ExpansionId[];
  goalMode: EndOfRoundGoalMode;
  startedAt: number;
  scores: Record<string, Record<string, number | null>>;
  endOfRoundPlacements: Record<string, EndOfRoundPlacements>;
  currentCategoryId: string;
  schemaVersion: number;
};

export type Game = {
  id: string;
  players: PlayerSnapshot[];
  expansions: ExpansionId[];
  goalMode: EndOfRoundGoalMode;
  startedAt: number;
  endedAt: number;
  scores: Record<string, Record<string, number>>;
  totals: Record<string, number>;
  ranking: { playerId: string; rank: number }[];
  schemaVersion: number;
};


export type CompletedGame = InProgressGame & {
  endedAt: number;
};
