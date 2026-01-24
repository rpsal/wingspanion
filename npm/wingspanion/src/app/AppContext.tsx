import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { InProgressGame, PlayerProfile, AppSettings } from "../domain/models";
import { loadDraftGame, saveDraftGame, deleteDraftGame } from "../services/persistence";
import { loadPlayers, savePlayers } from "../services/persistence";

type AppState = {
  players: PlayerProfile[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerProfile[]>>;

  settings: AppSettings;

  draftGame: InProgressGame | null;
  setDraftGame: (game: InProgressGame | null) => Promise<void>;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Players (global roster)
  const [players, _setPlayers] = useState<PlayerProfile[]>([]);

  const setPlayers: React.Dispatch<React.SetStateAction<PlayerProfile[]>> = updater => {
    _setPlayers(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePlayers(next);
      return next;
    });
  };

  // Settings (future use)
  const [settings] = useState<AppSettings>({});

  // Draft game
  const [draftGame, _setDraftGame] = useState<InProgressGame | null>(null);

  const setDraftGame = async (game: InProgressGame | null) => {
    if (game) {
      await saveDraftGame(game);
      _setDraftGame(game);
    } else {
      await deleteDraftGame();
      _setDraftGame(null);
    }
  };

  // Initialization gate
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      const [draft, loadedPlayers] = await Promise.all([
        loadDraftGame(),
        loadPlayers(),
      ]);

      if (draft) _setDraftGame(draft);
      _setPlayers(loadedPlayers);

      setInitialized(true);
    }
    init();
  }, []);

  if (!initialized) {
    return <div>Loading…</div>;
  }

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
        settings,
        draftGame,
        setDraftGame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return ctx;
}
