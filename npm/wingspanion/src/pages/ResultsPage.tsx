import { useNavigate } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import { CATEGORY_LABELS, BASE_CATEGORIES, OCEANIA_CATEGORIES, AMERICAS_CATEGORIES } from "../domain/scoringCategories";
import type { CategoryId } from "../domain/scoringCategories";

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

  // Build category list based on expansions
  const categories: CategoryId[] = [...BASE_CATEGORIES];
  if (draftGame.expansions.includes("oceania")) categories.push(...OCEANIA_CATEGORIES);
  if (draftGame.expansions.includes("americas")) categories.push(...AMERICAS_CATEGORIES);

  // Compute total score per player
  const totalScores: Record<string, number> = {};
  players.forEach(p => {
    const scores = draftGame.scores[p.id] ?? {};
    totalScores[p.id] = categories.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
  });

  // Sort players by total score descending
  const rankedPlayers = [...players].sort((a, b) => (totalScores[b.id] ?? 0) - (totalScores[a.id] ?? 0));

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "2rem 1rem",
        maxWidth: "480px",
        margin: "0 auto",
        gap: "1.5rem",
        textAlign: "center",
        backgroundColor: "#fafafa",
      }}
    >
      <h1>Game Results</h1>

      {/* Vertical table: rows = categories, columns = players */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Category</th>
            {players.map(p => (
              <th
                key={p.id}
                style={{
                  borderBottom: "2px solid #ccc",
                  padding: "0.5rem",
                  textAlign: "center",
                  minWidth: "60px",
                }}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat}>
              <td style={{ padding: "0.5rem", fontWeight: "bold" }}>{CATEGORY_LABELS[cat]}</td>
              {players.map(p => {
                const score = draftGame.scores[p.id]?.[cat] ?? 0;
                return (
                  <td key={p.id} style={{ padding: "0.5rem", textAlign: "center" }}>
                    {score}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Total scores row */}
          <tr>
            <td style={{ padding: "0.5rem", fontWeight: "bold" }}>Total</td>
            {players.map(p => (
              <td key={p.id} style={{ padding: "0.5rem", fontWeight: "bold", textAlign: "center" }}>
                {totalScores[p.id]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Final ranking */}
      <div style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>
        <strong>Final Ranking:</strong>{" "}
        {rankedPlayers.map((p, i) => (
          <span key={p.id}>
            {i + 1}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"}: {p.name}
            {i < rankedPlayers.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>

      {/* New Game button */}
      <button
        style={{
          marginTop: "2rem",
          padding: "0.75rem",
          backgroundColor: "#c0392b",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
        }}
        onClick={() => {
          setDraftGame(null);
          navigate("/new-game");
        }}
      >
        New Game
      </button>
    </div>
  );
}
