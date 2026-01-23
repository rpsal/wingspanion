import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import type { PlayerProfile } from "../domain/models";

export default function PlayersPage() {
  const { players, setPlayers } = useAppState();
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");

  const addPlayer = () => {
    if (!newName.trim()) return;

    const newPlayer: PlayerProfile = {
      id: crypto.randomUUID(),
      name: newName.trim(),
    };

    setPlayers(prev => [...prev, newPlayer]);
    setNewName("");
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem 1rem",
        maxWidth: "480px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Players</h1>

      {/* Add player */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Player name"
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addPlayer}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4a7c59",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Add
        </button>
      </div>

      {/* Player list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {players.map(p => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0.75rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <span>{p.name}</span>
            <button
              onClick={() => removePlayer(p.id)}
              style={{
                backgroundColor: "#c94c4c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "auto",
          padding: "0.75rem",
          backgroundColor: "#aaa",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Back
      </button>
    </div>
  );
}
