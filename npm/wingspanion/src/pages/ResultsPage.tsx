import { useNavigate } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import {
  CATEGORY_LABELS,
  BASE_CATEGORIES,
  OCEANIA_CATEGORIES,
  AMERICAS_CATEGORIES,
} from "../domain/scoringCategories";
import { PLAYER_COLORS } from "../domain/colors";
import type { CategoryId } from "../domain/scoringCategories";

const BASE = import.meta.env.BASE_URL;
const CATEGORY_ICON_SIZE = 32;
const CATEGORY_COL_WIDTH = 48;

export default function ResultsPage() {
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

  const players = draftGame.players;

  // Categories
  const categories: CategoryId[] = [...BASE_CATEGORIES];
  if (draftGame.expansions.includes("oceania"))
    categories.push(...OCEANIA_CATEGORIES);
  if (draftGame.expansions.includes("americas"))
    categories.push(...AMERICAS_CATEGORIES);

  // Totals
  const totalScores: Record<string, number> = {};
  players.forEach(p => {
    const scores = draftGame.scores[p.id] ?? {};
    totalScores[p.id] = categories.reduce(
      (sum, cat) => sum + (scores[cat] ?? 0),
      0
    );
  });

  // Determine winner
  const maxScore = Math.max(...Object.values(totalScores));
  const winnerIds = players
    .filter(p => totalScores[p.id] === maxScore)
    .map(p => p.id);

  // Compute tie-aware placements
  const placements: Record<string, number> = {};
  const sortedScores = [...players]
    .map(p => totalScores[p.id])
    .sort((a, b) => b - a);

  players.forEach(p => {
    const score = totalScores[p.id];
    placements[p.id] = sortedScores.indexOf(score) + 1;
  });

  const playerColWidth = `calc((100% - ${CATEGORY_COL_WIDTH}px) / ${players.length})`;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem",
        maxWidth: "100%",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "1.6rem" }}>
        Game Results
      </h1>

      {/* Table */}
      <table
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
          fontSize: "1rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                width: CATEGORY_COL_WIDTH,
              }}
            />

            {players.map(p => {
              const isWinner = winnerIds.includes(p.id);
              return (
                <th
                  key={p.id}
                  style={{
                    width: playerColWidth,
                    padding: "0.25rem",
                    backgroundColor: isWinner
                      ? "rgba(74,124,89,0.15)"
                      : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor:
                          PLAYER_COLORS[p.colorId] ?? "#999",
                        border: "1px solid rgba(0,0,0,0.3)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color:
                          PLAYER_COLORS[p.colorId] ?? "#000",
                        textAlign: "center",
                        lineHeight: 1.1,
                      }}
                    >
                      {p.name}
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {categories.map(cat => (
            <tr key={cat}>
              {/* Categories */}
              <td
                style={{
                  width: CATEGORY_COL_WIDTH,
                  textAlign: "center",
                  padding: "0.25rem 0",
                }}
              >
                <img
                  src={`${BASE}/misc/categories/${cat}.webp`}
                  alt={CATEGORY_LABELS[cat]}
                  width={CATEGORY_ICON_SIZE}
                  height={CATEGORY_ICON_SIZE}
                  style={{ objectFit: "contain" }}
                />
              </td>

              {players.map(p => {
                const isWinner = winnerIds.includes(p.id);
                const score = draftGame.scores[p.id]?.[cat] ?? 0;

                return (
                  <td
                    key={p.id}
                    style={{
                      width: playerColWidth,
                      textAlign: "center",
                      padding: "0.4rem 0",
                      fontWeight: 500,
                      backgroundColor: isWinner
                        ? "rgba(74,124,89,0.08)"
                        : undefined,
                    }}
                  >
                    {score}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Total */}
          <tr>
            <td
              style={{
                width: CATEGORY_COL_WIDTH,
                textAlign: "center",
                fontWeight: 700,
                paddingTop: "0.5rem",
              }}
            >
              Σ
            </td>

            {players.map(p => {
              const isWinner = winnerIds.includes(p.id);
              return (
                <td
                  key={p.id}
                  style={{
                    width: playerColWidth,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    padding: "0.5rem 0",
                    backgroundColor: isWinner
                      ? "rgba(74,124,89,0.2)"
                      : undefined,
                  }}
                >
                  {totalScores[p.id]}
                </td>
              );
            })}
          </tr>

          {/* Placement */}
          <tr>
            <td
              style={{
                width: CATEGORY_COL_WIDTH,
                textAlign: "center",
                fontWeight: 700,
                paddingTop: "0.5rem",
              }}
            >
              #
            </td>

            {players.map(p => {
              const isWinner = winnerIds.includes(p.id);
              const place = placements[p.id];

              const suffix =
                place === 1 ? "st" :
                place === 2 ? "nd" :
                place === 3 ? "rd" : "th";

              return (
                <td
                  key={p.id}
                  style={{
                    width: playerColWidth,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    padding: "0.5rem 0",
                    backgroundColor: isWinner
                      ? "rgba(74,124,89,0.15)"
                      : undefined,
                  }}
                >
                  {place}
                  {suffix}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() => navigate("/score")}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#777",
            color: "white",
          }}
        >
          Back to Scoring
        </button>

        <button
          onClick={() => {
            setDraftGame(null);
            navigate("/new-game");
          }}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#c0392b",
            color: "white",
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
