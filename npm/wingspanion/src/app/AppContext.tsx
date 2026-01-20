import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { InProgressGame, PlayerProfile, AppSettings } from "../domain/models";

import { loadDraftGame, saveDraftGame, deleteDraftGame } from "../services/persistence";

type AppState = {
  players: PlayerProfile[];
  settings: AppSettings;
  draftGame: InProgressGame | null;

  setDraftGame: (game: InProgressGame | null) => void;
  setPlayers: (players: PlayerProfile[]) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Players state
  const [players, _setPlayers] = useState<PlayerProfile[]>([]);
  const setPlayers = (newPlayers: PlayerProfile[]) => {
    _setPlayers(newPlayers);
  };

  // Settings state
  const [settings] = useState<AppSettings>({});

  // Draft game state
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

  // Initialization flag
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      const draft = await loadDraftGame();
      if (draft) {
        _setDraftGame(draft);
      }
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
        settings,
        draftGame,
        setDraftGame,
        setPlayers,
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
