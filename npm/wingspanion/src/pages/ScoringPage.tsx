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

  const isGreenEndOfRoundGoals =
    currentCategory === "end_of_round_goals" &&
    draftGame.goalMode === "green";

  const placementsForRound: Record<string, Placement> = {};
  draftGame.players.forEach(p => {
    placementsForRound[p.id] =
      draftGame.endOfRoundPlacements?.[p.id]?.[currentRound] ?? 0;
  });

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

  // const currentPlacements: EndOfRoundPlacements =
  //   draftGame.endOfRoundPlacements[currentPlayer.id] ?? {
  //   round1: 0,
  //   round2: 0,
  //   round3: 0,
  //   round4: 0,
  // };

  const updatePlacement = (
    playerId: string,
    round: keyof EndOfRoundPlacements,
    value: Placement
  ) => {
    setDraftGame({
      ...draftGame,
      endOfRoundPlacements: {
        ...draftGame.endOfRoundPlacements,
        [playerId]: {
          ...(draftGame.endOfRoundPlacements[playerId] ?? {
            round1: 0,
            round2: 0,
            round3: 0,
            round4: 0,
          }),
          [round]: value,
        },
      },
    });
  };

  const ALL_PLACEMENTS: Placement[] = [1, 2, 3, 0];

  function getValidPlacements(
    placements: Record<string, Placement>,
    currentPlayerId: string
  ): Placement[] {
    const counts = { 1: 0, 2: 0, 3: 0 };

    Object.entries(placements).forEach(([pid, place]) => {
      if (pid === currentPlayerId) return;
      if (place != 0) counts[place]++;
    });

    const valid = new Set<Placement>();
    valid.add(0);   // "--" always allowed
    valid.add(1);   // 1st always allowed

    if (counts[1] < 2) valid.add(2);
    if (counts[1] + counts[2] < 3) valid.add(3);

    return ALL_PLACEMENTS.filter(p => valid.has(p));
  }

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
      <div>
        <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          {CATEGORY_LABELS[currentCategory]}
        </div>
        { isGreenEndOfRoundGoals ? 
          (<h2>ROUND {currentRoundLabel}</h2>) : 
          (<h2>{currentPlayer.name}</h2>) 
        }
      </div>
      
      { isGreenEndOfRoundGoals ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        { draftGame.players.map(player => {
          const validOptions = getValidPlacements(
            placementsForRound,
            player.id
          );

          const roundKey = `round${roundIndex + 1}` as keyof EndOfRoundPlacements;

          return (
            <div
              key={player.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{player.name}</span>

              <select
                value={placementsForRound[player.id] ?? ""}
                onChange={e =>
                  updatePlacement(
                    player.id,
                    roundKey,
                    e.target.value === "" ? 0 : Number(e.target.value) as Placement
                  )
                }
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
