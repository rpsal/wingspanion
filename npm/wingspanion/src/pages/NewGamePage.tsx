import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ExpansionId, InProgressGame } from "../domain/models";
import { useAppState } from "../app/AppContext";
import PlayerSelector from "../components/PlayerSelector";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;

// Available expansions
const AVAILABLE_EXPANSIONS: { id: ExpansionId; label: string }[] = [
  { id: "base", label: "Base Game (Swift Start Pack)" },
  { id: "europe", label: "European Expansion" },
  { id: "oceania", label: "Oceania Expansion" },
  { id: "asia", label: "Asia Expansion" },
  { id: "americas", label: "Americas Expansion" },
  { id: "fanPack1", label: "Fan-Designed Bird Promo Packs: Set 1" },
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

  const toggleExpansion = (expId: ExpansionId) => {
    setSelectedExpansions(prev =>
      prev.includes(expId)
        ? prev.filter(e => e !== expId)
        : [...prev, expId]
    );
  };

  const startGame = async () => {
    if (selectedPlayers.length === 0) return;
    if (
      !selectedExpansions.includes("base") &&
      !selectedExpansions.includes("asia")
    )
      return;

    const newDraft: InProgressGame = {
      id: `game-${Date.now()}`,
      players: selectedPlayers,
      expansions: selectedExpansions,
      startedAt: Date.now(),
      scores: {},
      currentCategoryId: "bird_scores",
      schemaVersion: 1,
    };

    await setDraftGame(newDraft);
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
        <h1 style={{ textAlign: "center" }}>New Game</h1>

        <PlayerSelector
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          setSelectedPlayerIds={setSelectedPlayerIds}
        />
        {selectedPlayers.length < 2 && (
          <div style={{ fontSize: "0.85rem", color: "#c0392b" }}>
            Select 2–5 players to start
          </div>
        )}

        <section>
          <h2 style={{ marginBottom: "1rem" }}>Select Expansions</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {AVAILABLE_EXPANSIONS.map(exp => (
              <label
                key={exp.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  backgroundColor: selectedExpansions.includes(exp.id)
                    ? "#d0f0d0"
                    : "white",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedExpansions.includes(exp.id)}
                  onChange={() => toggleExpansion(exp.id)}
                  style={{ marginRight: "0.5rem" }}
                />
                {exp.label}
              </label>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
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
            Start Game
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
            Clear Draft
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
