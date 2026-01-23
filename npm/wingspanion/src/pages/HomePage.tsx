import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1>Wingspanion</h1>

      <Link to="/new-game">
        <button
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Start New Game
        </button>
      </Link>

      <Link to="/players">
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#777",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Player Management
        </button>
      </Link>
    </div>
  );
}
