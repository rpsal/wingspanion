import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import type { CategoryId } from "../domain/scoringCategories";
import {
  BASE_CATEGORIES,
  OCEANIA_CATEGORIES,
  AMERICAS_CATEGORIES,
  DERIVED_CATEGORIES,
  CATEGORY_LABELS,
} from "../domain/scoringCategories";

export default function ScoringPage() {
  const { draftGame, setDraftGame } = useAppState();
  const navigate = useNavigate();

  if (!draftGame) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>No active game</h2>
        <button onClick={() => navigate("/new-game")}>Back to New Game</button>
      </div>
    );
  }

  // Build category list based on expansions
  const allCategories: CategoryId[] = [...BASE_CATEGORIES];
  if (draftGame.expansions.includes("oceania")) allCategories.push(...OCEANIA_CATEGORIES);
  if (draftGame.expansions.includes("americas")) allCategories.push(...AMERICAS_CATEGORIES);
  const categories = allCategories.filter(
    category => !DERIVED_CATEGORIES.includes(category as any)
  );

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);

  const currentCategory = categories[categoryIndex];
  const currentPlayer = draftGame.players[playerIndex];

  const currentScore =
    draftGame.scores[currentPlayer.id]?.[currentCategory] ?? "";

  const updateScore = (value: number) => {
    const updatedDraft = {
      ...draftGame,
      scores: {
        ...draftGame.scores,
        [currentPlayer.id]: {
          ...draftGame.scores[currentPlayer.id],
          [currentCategory]: value,
        },
      },
    };

    setDraftGame(updatedDraft);
  };

  const goNext = () => {
    if (playerIndex < draftGame.players.length - 1) {
      setPlayerIndex(playerIndex + 1);
    } else if (categoryIndex < categories.length - 1) {
      setPlayerIndex(0);
      setCategoryIndex(categoryIndex + 1);
    } else {
      navigate("/results");
    }
  };

  const goBack = () => {
    if (playerIndex > 0) {
      setPlayerIndex(playerIndex - 1);
    } else if (categoryIndex > 0) {
      setPlayerIndex(draftGame.players.length - 1);
      setCategoryIndex(categoryIndex - 1);
    } else {
      navigate("/new-game");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "1.5rem",
        maxWidth: "420px",
        margin: "0 auto",
        gap: "1.5rem",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          {CATEGORY_LABELS[currentCategory]}
        </div>
        <h2>{currentPlayer.name}</h2>
      </div>

      <input
        type="number"
        min={0}
        value={currentScore}
        onChange={e => updateScore(parseInt(e.target.value) || 0)}
        style={{
          fontSize: "2rem",
          textAlign: "center",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {/* Buttons container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Back left, Next right
          gap: "1rem",
        }}
      >
        <button
          onClick={goBack}
          style={{
            flex: 1,
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: "#c0392b", // red
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Back
        </button>

        <button
          onClick={goNext}
          style={{
            flex: 1,
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Next
        </button>
      </div>

      <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>
        Player {playerIndex + 1} of {draftGame.players.length} · Category{" "}
        {categoryIndex + 1} of {categories.length}
      </div>
    </div>
  );
}
