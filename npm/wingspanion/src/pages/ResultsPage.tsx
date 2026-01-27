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
const CATEGORY_ICON_SIZE = 28;

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
  if (draftGame.expansions.includes("oceania")) categories.push(...OCEANIA_CATEGORIES);
  if (draftGame.expansions.includes("americas")) categories.push(...AMERICAS_CATEGORIES);

  // Totals
  const totalScores: Record<string, number> = {};
  players.forEach(p => {
    const scores = draftGame.scores[p.id] ?? {};
    totalScores[p.id] = categories.reduce(
      (sum, cat) => sum + (scores[cat] ?? 0),
      0
    );
  });

  const maxScore = Math.max(...Object.values(totalScores));
  const winners = new Set(
    players.filter(p => totalScores[p.id] === maxScore).map(p => p.id)
  );

  const ordinal = (n: number) =>
    n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;

  // Placements with ties
  const sorted = [...players].sort(
    (a, b) => totalScores[b.id] - totalScores[a.id]
  );

  const placements: Record<string, number> = {};
  let place = 1;
  sorted.forEach((p, i) => {
    if (i > 0 && totalScores[p.id] < totalScores[sorted[i - 1].id]) {
      place = i + 1;
    }
    placements[p.id] = place;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1.25rem 0.75rem",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "1.4rem",
        }}
      >
        Game Results
      </h1>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "520px",
            fontSize: "1rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  background: "#fafafa",
                }}
              />
              {players.map(p => {
                const isWinner = winners.has(p.id);
                return (
                  <th
                    key={p.id}
                    style={{
                      padding: "0.75rem 0.5rem",
                      backgroundColor: isWinner ? "#fff6d6" : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          backgroundColor: PLAYER_COLORS[p.colorId],
                          border: "1px solid rgba(0,0,0,0.3)",
                        }}
                      />
                      <span
                        style={{
                          color: PLAYER_COLORS[p.colorId],
                          fontWeight: 600,
                          fontSize: "0.95rem",
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
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "#fafafa",
                    padding: "0.6rem",
                    textAlign: "center",
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
                  const isWinner = winners.has(p.id);
                  return (
                    <td
                      key={p.id}
                      style={{
                        padding: "0.6rem",
                        textAlign: "center",
                        backgroundColor: isWinner ? "#fff6d6" : undefined,
                      }}
                    >
                      {draftGame.scores[p.id]?.[cat] ?? 0}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Total */}
            <tr>
              <td
                style={{
                  position: "sticky",
                  left: 0,
                  background: "#fafafa",
                  fontWeight: 700,
                  padding: "0.6rem",
                  textAlign: "center",
                }}
              >
                Σ
              </td>
              {players.map(p => {
                const isWinner = winners.has(p.id);
                return (
                  <td
                    key={p.id}
                    style={{
                      fontWeight: 700,
                      textAlign: "center",
                      backgroundColor: isWinner ? "#fff6d6" : undefined,
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
                  position: "sticky",
                  left: 0,
                  background: "#fafafa",
                  fontWeight: 600,
                  padding: "0.6rem",
                  textAlign: "center",
                }}
              >
                Place
              </td>
              {players.map(p => {
                const isWinner = winners.has(p.id);
                return (
                  <td
                    key={p.id}
                    style={{
                      fontWeight: 600,
                      textAlign: "center",
                      backgroundColor: isWinner ? "#fff6d6" : undefined,
                    }}
                  >
                    {ordinal(placements[p.id])}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={() => navigate("/score")}
          style={{
            flex: 1,
            padding: "0.85rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#aaa",
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
            flex: 1,
            padding: "0.85rem",
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
