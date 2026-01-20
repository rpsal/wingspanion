import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
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
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Start New Game
        </button>
      </Link>
    </div>
  );
}
