import { Link } from "react-router-dom";

const BUTTON_WIDTH = "320px";

const buttonBase: React.CSSProperties = {
  width: "100%",
  padding: "0.9rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: "8px",
  color: "white",
};

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1>Wingspanion</h1>

      {/* Start Game */}
      <div style={{ width: BUTTON_WIDTH }}>
        <Link to="/new-game">
          <button
            style={{
              ...buttonBase,
              backgroundColor: "#4a7c59",
              fontSize: "1.1rem",
            }}
          >
            Start New Game
          </button>
        </Link>
      </div>

      {/* Player Management */}
      <div style={{ width: BUTTON_WIDTH }}>
        <Link to="/players">
          <button
            style={{
              ...buttonBase,
              backgroundColor: "#777",
            }}
          >
            Player Management
          </button>
        </Link>
      </div>

      {/* Player Stats (disabled) */}
      <div style={{ width: BUTTON_WIDTH }}>
        <button
          disabled
          style={{
            ...buttonBase,
            backgroundColor: "#aaa",
            cursor: "not-allowed",
          }}
        >
          Player Stats (Coming Soon)
        </button>
      </div>

      {/* Game History (disabled) */}
      <div style={{ width: BUTTON_WIDTH }}>
        <button
          disabled
          style={{
            ...buttonBase,
            backgroundColor: "#aaa",
            cursor: "not-allowed",
          }}
        >
          Game History (Coming Soon)
        </button>
      </div>
    </div>
  );
}
