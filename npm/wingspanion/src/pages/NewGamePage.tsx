import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ExpansionId, InProgressGame } from "../domain/models";
import { useAppState } from "../app/AppContext";
import PlayerSelector from "../components/PlayerSelector";

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
          <div style={{ fontSize: "0.85rem", color: "#c0392b", textAlign: "center" }}>
            Select 2–5 players to start
          </div>
        )}
        
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
