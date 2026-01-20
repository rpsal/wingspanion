import { openDB } from "idb";
import type { DBSchema } from "idb";

import type {
  InProgressGame,
  Game,
  PlayerProfile,
  AppSettings
} from "../domain/models";


const DB_NAME = "wingspan-scorepad";
const DB_VERSION = 1;

interface WingspanDB extends DBSchema {
  drafts: {
    key: string;
    value: InProgressGame;
  };
  games: {
    key: string;
    value: Game;
  };
  players: {
    key: string;
    value: PlayerProfile;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

const dbPromise = openDB<WingspanDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("drafts")) {
      db.createObjectStore("drafts");
    }
    if (!db.objectStoreNames.contains("games")) {
      db.createObjectStore("games");
    }
    if (!db.objectStoreNames.contains("players")) {
      db.createObjectStore("players");
    }
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings");
    }
  },
});

// Draft Game

const DRAFT_KEY = "current";

export async function loadDraftGame(): Promise<InProgressGame | null> {
  const db = await dbPromise;
  return (await db.get("drafts", DRAFT_KEY)) ?? null;
}

export async function saveDraftGame(game: InProgressGame): Promise<void> {
  const db = await dbPromise;
  await db.put("drafts", game, DRAFT_KEY);
}

export async function deleteDraftGame(): Promise<void> {
  const db = await dbPromise;
  await db.delete("drafts", DRAFT_KEY);
}

// Player Management

export async function getPlayers(): Promise<PlayerProfile[]> {
  const db = await dbPromise;
  return (await db.getAll("players")) ?? [];
}

export async function savePlayer(player: PlayerProfile): Promise<void> {
  const db = await dbPromise;
  await db.put("players", player, player.id);
}

export async function deletePlayer(playerId: string): Promise<void> {
  const db = await dbPromise;
  await db.delete("players", playerId);
}