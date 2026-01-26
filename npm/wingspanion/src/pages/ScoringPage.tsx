import { useState, useEffect } from "react";
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
import type { Placement, EndOfRoundPlacements } from "../domain/endOfRoundScoring";
import { 
  isRoundPlacementValid, 
  getValidPlacements, 
  normalizePlacementsForRound 
} from "../domain/endOfRoundScoring";
import { PLAYER_COLORS } from "../domain/colors";

const stepButtonStyle: React.CSSProperties = {
  width: "56px",
  height: "56px",
  fontSize: "2rem",
  fontWeight: 600,
  borderRadius: "12px",
  border: "1px solid #ccc",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
  touchAction: "manipulation",
  userSelect: "none",
};

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

  const rounds: (keyof EndOfRoundPlacements)[] = [
    "round1",
    "round2",
    "round3",
    "round4",
  ];

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);

  const currentCategory = categories[categoryIndex];
  const currentPlayer = draftGame.players[playerIndex];
  const currentRound = rounds[roundIndex];
  const currentRoundLabel = roundIndex + 1;

  const BASE = import.meta.env.BASE_URL;

  const isGreenEndOfRoundGoals =
    currentCategory === "end_of_round_goals" &&
    draftGame.goalMode === "green";

  const placementsForRound: Record<string, Placement> = {};
  draftGame.players.forEach(p => {
    placementsForRound[p.id] =
      draftGame.endOfRoundPlacements?.[p.id]?.[currentRound] ?? 0;
  });

  const isRoundValid =
    isGreenEndOfRoundGoals &&
    isRoundPlacementValid(placementsForRound);

  const currentScore =
    draftGame.scores[currentPlayer.id]?.[currentCategory] ?? 0;

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

  const updatePlacement = (
    playerId: string,
    round: keyof EndOfRoundPlacements,
    value: Placement
  ) => {
    const roundPlacements: Record<string, Placement> = {};

    draftGame.players.forEach(player => {
      roundPlacements[player.id] =
        draftGame.endOfRoundPlacements[player.id]?.[round] ?? 0;
    });

    roundPlacements[playerId] = value;

    const normalizedRound = normalizePlacementsForRound(
      roundPlacements,
      draftGame.players.length
    );

    const updatedEndOfRoundPlacements = {
      ...draftGame.endOfRoundPlacements,
    };

    draftGame.players.forEach(player => {
      updatedEndOfRoundPlacements[player.id] = {
        ...(updatedEndOfRoundPlacements[player.id] ?? {
          round1: 0,
          round2: 0,
          round3: 0,
          round4: 0,
        }),
        [round]: normalizedRound[player.id],
      };
    });

    setDraftGame({
      ...draftGame,
      endOfRoundPlacements: updatedEndOfRoundPlacements,
    });
  };

  const goNext = () => {
    if (isGreenEndOfRoundGoals) {
      if (roundIndex < 3) {
        setRoundIndex(r => r + 1);
      } else {
        setRoundIndex(0);
        setCategoryIndex(c => c + 1);
      }
      return;
    }
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
    if (isGreenEndOfRoundGoals) {
      if (roundIndex > 0) {
        setRoundIndex(r => r - 1);
      } else {
        setRoundIndex(3);
        setCategoryIndex(c => c - 1);
      }
      return;
    }
    if (playerIndex > 0) {
      setPlayerIndex(playerIndex - 1);
    } else if (categoryIndex > 0) {
      setPlayerIndex(draftGame.players.length - 1);
      setCategoryIndex(categoryIndex - 1);
    } else {
      navigate("/new-game");
    }
  };

  useEffect(() => {
    if (
      currentCategory === "end_of_round_goals" &&
      draftGame.goalMode === "green"
    ) {
      setRoundIndex(0);
    }
  }, [currentCategory, draftGame.goalMode]);

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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        {/* Category Icon */}
        <img
          src={`${BASE}/misc/categories/${currentCategory}.webp`}
          alt={CATEGORY_LABELS[currentCategory]}
          style={{
            width: "64px",
            height: "64px",
            objectFit: "contain", // ensures different sizes fit nicely
          }}
        />

        {/* Category label */}
        <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          {CATEGORY_LABELS[currentCategory]}
        </div>

        {/* Player or round info */}
        {isGreenEndOfRoundGoals ? (
          <h2>ROUND {currentRoundLabel}</h2>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: PLAYER_COLORS[currentPlayer.colorId] ?? "#999",
                border: "2px solid rgba(0,0,0,0.2)",
                flexShrink: 0,
              }}
            />
            <h2
              style={{
                margin: 0,
                color: PLAYER_COLORS[currentPlayer.colorId] ?? "inherit",
              }}
            >
              {currentPlayer.name}
            </h2>
          </div>
        )}
      </div>
      
      { isGreenEndOfRoundGoals ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        { draftGame.players.map(player => {
          const validOptions = getValidPlacements(
            placementsForRound,
            player.id,
            draftGame.players.length
          );

          const roundKey = `round${roundIndex + 1}` as keyof EndOfRoundPlacements;

          return (
            <div
              key={player.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  minWidth: 0,
                }}
              >
                {/* Player color */}
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: PLAYER_COLORS[player.colorId] ?? "#999",
                    border: "2px solid rgba(0, 0, 0, 0.25)",
                    flexShrink: 0,
                  }}
                />
                {/* Player name */}
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    color: PLAYER_COLORS[player.colorId] ?? "inherit",
                  }}
                >
                  {player.name}
                </span>
              </div>

              {/* Placement dropdown */}
              <select
                value={placementsForRound[player.id] ?? ""}
                onChange={e =>
                  updatePlacement(
                    player.id,
                    roundKey,
                    e.target.value === "" ? 0 : (Number(e.target.value) as Placement)
                  )
                }
                style={{
                  fontSize: "1.2rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  minWidth: "6rem",
                  textAlign: "center",
                  backgroundColor: "white",
                }}
              >
                {validOptions.map(opt => (
                  <option key={opt ?? "0"} value={opt ?? ""}>
                    {opt === 0
                      ? "--"
                      : opt === 1
                      ? "1st"
                      : opt === 2
                      ? "2nd"
                      : "3rd"}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => updateScore(currentScore-10)}
            style={stepButtonStyle}
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => updateScore(currentScore-1)}
            style={stepButtonStyle}
          >
            &lt;
          </button>
          <div
            style={{
              flex: 1,
              fontSize: "3rem",
              fontWeight: 700,
              textAlign: "center",
              userSelect: "none",
            }}
          >
            {currentScore}
          </div>
          <button
            onClick={() => updateScore(currentScore+1)}
            style={stepButtonStyle}
          >
            &gt;
          </button>
          <button
            onClick={() => updateScore(currentScore+10)}
            style={stepButtonStyle}
          >
            &gt;&gt;
          </button>
        </div>
      )}
      { isGreenEndOfRoundGoals && !isRoundValid && (
        <div style={{ fontSize: "0.8rem", color: "#c0392b" }}>
          Each round must have at least one 1st place, and placements must be valid.
        </div>
      )}

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
          disabled={isGreenEndOfRoundGoals && !isRoundValid}
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

      { isGreenEndOfRoundGoals ? (
        <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>
          Category{" "}{categoryIndex + 1} of {categories.length}
        </div>
      ) : (
      <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>
        Player {playerIndex + 1} of {draftGame.players.length} · Category{" "}
        {categoryIndex + 1} of {categories.length}
      </div>
      )}
    </div>
  );
}
