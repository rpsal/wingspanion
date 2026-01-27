import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ExpansionId, EndOfRoundGoalMode, InProgressGame } from "../domain/models";
import { useAppState } from "../app/AppContext";
import PlayerSelector from "../components/PlayerSelector";
import { getCategoriesForExpansions, ALL_CATEGORIES } from "../domain/scoringCategories";
import { preloadCategoryIcons } from "../domain/icons";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;

const BASE = import.meta.env.BASE_URL;

// Available expansions
const AVAILABLE_EXPANSIONS: { id: ExpansionId; label: string; image: string }[] = [
  { id: "base", label: "Base Game", image: `${BASE}/expansions/base.png` },
  { id: "europe", label: "Europe", image: `${BASE}/expansions/europe.png`},
  { id: "oceania", label: "Oceania", image: `${BASE}/expansions/oceania.png` },
  { id: "asia", label: "Asia", image: `${BASE}/expansions/asia.png` },
  { id: "americas", label: "Americas", image: `${BASE}/expansions/americas.png` },
  { id: "fanPack1", label: "Fan Pack 1", image: `${BASE}/expansions/fanPack1.png` },
];

const GOAL_MODES: { id: EndOfRoundGoalMode; label: string; image: string }[] = [
  { id: "green", label: "Majority per Item", image: `${BASE}/misc/goalGreen.png` },
  { id: "blue", label: "One Point per Item", image: `${BASE}/misc/goalBlue.png` },
];

export default function NewGamePage() {
  const { players, draftGame, setDraftGame } = useAppState();
  const navigate = useNavigate();

  // Selection state (IDs, not objects)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
    draftGame?.players.map(p => p.id) ?? []
  );

  const [selectedExpansions, setSelectedExpansions] = useState<ExpansionId[]>(
    draftGame?.expansions ?? ["base"]
  );

  const [selectedGoalMode, setSelectedGoalMode] = useState<EndOfRoundGoalMode>(
    draftGame?.goalMode ?? "green"
  );

  // State of the game
  const initialPlayerIds = draftGame?.players.map(p => p.id) ?? [];
  const initialExpansions = draftGame?.expansions ?? ["base"];
  const playersChanged = 
      selectedPlayerIds.sort().join(",") !== initialPlayerIds.sort().join(",");
  const expansionsChanged =
      selectedExpansions.sort().join(",") !== initialExpansions.sort().join(",");


  // Derived selected players
  const selectedPlayers = players.filter(p =>
    selectedPlayerIds.includes(p.id)
  );

  // Reset local state if draft is cleared elsewhere
  useEffect(() => {
    if (!draftGame) {
      setSelectedPlayerIds([]);
      setSelectedExpansions(["base"]);
    }
  }, [draftGame]);

  // Preload category icons
  const categories = [...ALL_CATEGORIES]
  useEffect(() => {
    preloadCategoryIcons(categories);
  }, [categories]);

  const toggleExpansion = (expId: ExpansionId) => {
    setSelectedExpansions(prev =>
      prev.includes(expId)
        ? prev.filter(e => e !== expId)
        : [...prev, expId]
    );
  };

  const startGame = async () => {
    if (selectedPlayers.length === 0) return;
    if (!selectedExpansions.includes("base") && !selectedExpansions.includes("asia")) return;

    const initialCategories = getCategoriesForExpansions(selectedExpansions);

    if (playersChanged || !draftGame) {
      // Clear draft and initialize scores for all categories
      const initialScores: Record<string, Record<string, number>> = {};
      selectedPlayers.forEach(player => {
        initialScores[player.id] = {};
        initialCategories.forEach(cat => {
          initialScores[player.id][cat] = 0;
        });
      });

      const newDraft: InProgressGame = {
        id: `game-${Date.now()}`,
        players: selectedPlayers,
        expansions: selectedExpansions,
        goalMode: selectedGoalMode,
        startedAt: Date.now(),
        scores: initialScores,
        endOfRoundPlacements: {},
        currentCategoryId: "bird_scores",
        schemaVersion: 1,
      };

      await setDraftGame(newDraft);

    } else if (expansionsChanged && draftGame) {
      // Keep existing scores, zero newly added categories
      const newScores = { ...draftGame.scores };

      initialCategories.forEach(cat => {
        draftGame.players.forEach(player => {
          if (!newScores[player.id]) newScores[player.id] = {};
          // Only zero if the player doesn't already have a score for this category
          if (!(cat in newScores[player.id])) {
            newScores[player.id][cat] = 0;
          }
        });
      });

      const updatedDraft: InProgressGame = {
        ...draftGame,
        expansions: selectedExpansions,
        scores: newScores,
      };

      await setDraftGame(updatedDraft);

    } else if (draftGame) {
      // Nothing changed, continue existing game
      await setDraftGame(draftGame);
    }

    navigate("/score");
  };

  const clearDraft = async () => {
    await setDraftGame(null);
    setSelectedPlayerIds([]);
    setSelectedExpansions(["base"]);
  };

  const isStartDisabled =
    selectedPlayers.length < MIN_PLAYERS ||
    selectedPlayers.length > MAX_PLAYERS ||
    (!selectedExpansions.includes("base") &&
      !selectedExpansions.includes("asia"));

  const startButtonLabel = (() => {
    if (!draftGame) return "Start Game";
    if (playersChanged) return "Start Game";
    if (!playersChanged && !expansionsChanged) return "Continue Game";
    return "Start Game";
  })();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <PlayerSelector
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          setSelectedPlayerIds={setSelectedPlayerIds}
        />
        
        <section style={{ textAlign: "center" }}>
          <h2>Select Expansions</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {AVAILABLE_EXPANSIONS.map(exp => {
              const selected = selectedExpansions.includes(exp.id);
              return (
                <div
                  key={exp.id}
                  onClick={() => toggleExpansion(exp.id)}
                  style={{
                    width: "100px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: selected ? "2px solid #4a7c59" : "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "0.25rem",
                    cursor: "pointer",
                    backgroundColor: selected ? "#e0f8e0" : "white",
                  }}
                >
                  <img
                    src={exp.image}
                    alt={exp.label}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "0.25rem",
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", textAlign: "center" }}>
                    {exp.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ textAlign: "center" }}>
          <h2>End-of-Round Goal Scoring</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {GOAL_MODES.map(mode => {
              const selected = selectedGoalMode === mode.id;
              return (
                <div
                  key={mode.id}
                  onClick={() => setSelectedGoalMode(mode.id)}
                  style={{
                    width: "100px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: selected ? "2px solid #4a7c59" : "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "0.25rem",
                    cursor: "pointer",
                    backgroundColor: selected ? "#e0f8e0" : "white",
                  }}
                >
                  <img
                    src={mode.image}
                    alt={mode.label}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "0.25rem",
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", textAlign: "center" }}>
                    {mode.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem",
              backgroundColor: "#aaa",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Back
          </button>
          <button
            onClick={startGame}
            disabled={isStartDisabled}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: isStartDisabled ? "#aaa" : "#4a7c59",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isStartDisabled ? "not-allowed" : "pointer",
            }}
          >
            {startButtonLabel}
          </button>

          <button
            onClick={clearDraft}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: "#c94c4c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Reset Game
          </button>
        </div>

        {/* Debug Draft View */}
        {draftGame && (
          <section
            style={{
              backgroundColor: "#f0f0f0",
              padding: "1rem",
              borderRadius: "6px",
              wordBreak: "break-word",
            }}
          >
            <h3>Current Draft (Debug)</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(draftGame, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
