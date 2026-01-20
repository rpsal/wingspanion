import type { CategoryId } from "./scoringCategories";

export type ExpansionId =
  | "base"
  | "europe"
  | "oceania"
  | "asia"
  | "americas"
  | "fanPack1";

// Player and App Models

export type PlayerProfile = {
  id: string;
  name: string;
  color?: string;
};

export type AppSettings = {
  // reserved for future settings
};

export type PlayerSnapshot = {
  id: string;
  name: string;
  color?: string;
};

// Scoring Models

export type RoundPlacement = 1 | 2 | 3 | 4 | 0;

export type EndOfRoundScores = {
  rounds: RoundPlacement[];
};

export type ScoreValue = number | EndOfRoundScores;

export type PlayerScores = {
  [categoryId in CategoryId]?: ScoreValue;
};

// Game Models

export type InProgressGame = {
  id: string;
  players: PlayerSnapshot[];
  expansions: ExpansionId[];
  startedAt: number;
  scores: Record<string, Record<string, number | null>>;
  currentCategoryId: string;
  schemaVersion: number;
};

export type Game = {
  id: string;
  players: PlayerSnapshot[];
  expansions: ExpansionId[];
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
