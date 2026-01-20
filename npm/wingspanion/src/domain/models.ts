export type ExpansionId =
  | "base"
  | "europe"
  | "oceania"
  | "asia"
  | "americas";

export type PlayerProfile = {
  id: string;
  name: string;
  color?: string;
};

export type PlayerSnapshot = {
  id: string;
  name: string;
  color?: string;
};

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

export type AppSettings = Record<string, unknown>;
