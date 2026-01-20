import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CategoryId } from "../domain/scoringCategories";
import {
  BASE_CATEGORIES,
  OCEANIA_CATEGORIES,
  AMERICAS_CATEGORIES,
  CATEGORY_LABELS,
} from "../domain/scoringCategories";
import { useAppState } from "../app/AppContext";

export default function ScoringPage() {
  const { draftGame, setDraftGame } = useAppState();
  const navigate = useNavigate();

  // --- Handle case where no draft exists ---
  if (!draftGame) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <h2>No game draft found</h2>
        <p>Please start a new game first.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Go to New Game
        </button>
      </div>
    );
  }

  // --- Build categories dynamically based on expansions ---
  const categories: CategoryId[] = [...BASE_CATEGORIES];
  if (draftGame.expansions.includes("oceania")) categories.push(...OCEANIA_CATEGORIES);
  if (draftGame.expansions.includes("americas")) categories.push(...AMERICAS_CATEGORIES);

  // --- Local state for scores ---
  const [scores, setScores] = useState<{ [playerId: string]: { [category in CategoryId]?: number } }>(
    draftGame.scores || {}
  );

  // --- Sync local scores with draft in AppContext ---
  useEffect(() => {
    setDraftGame({ ...draftGame, scores });
  }, [scores]);

  // --- Update score for a player/category ---
  const handleScoreChange = (playerId: string, category: CategoryId, value: string) => {
    const numeric = parseInt(value) || 0;
    setScores(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [category]: numeric,
      },
    }));
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "480px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Scoring</h1>

      {draftGame.players.map(player => (
        <section
          key={player.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "1rem",
          }}
        >
          <h2>{player.name}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {categories.map(category => (
              <label
                key={category}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{CATEGORY_LABELS[category]}</span>
                <input
                  type="number"
                  min={0}
                  value={scores[player.id]?.[category] ?? ""}
                  onChange={e => handleScoreChange(player.id, category, e.target.value)}
                  style={{
                    width: "4rem",
                    textAlign: "right",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    padding: "0.25rem",
                  }}
                />
              </label>
            ))}
          </div>
        </section>
      ))}

      <button
        onClick={() => navigate("/results")}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4a7c59",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Finish & View Results
      </button>
    </div>
  );
}
