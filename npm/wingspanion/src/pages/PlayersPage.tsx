import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import { AVATARS, AVATAR_IDS } from "../domain/avatars";
import { PLAYER_COLORS } from "../domain/colors";
import type { PlayerColorId } from "../domain/colors";
import type { AvatarId } from "../domain/avatars";
import { ColorPicker } from "../components/ColorPicker";

export default function PlayersPage() {
  const { players, setPlayers } = useAppState();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [colorId, setColorId] = useState<PlayerColorId>("blue");
  const [avatarId, setAvatarId] = useState<AvatarId>("bird1");

  const generateId = () =>
    crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  
  const addPlayer = () => {
    if (!name.trim()) return;

    setPlayers([
      ...players,
      {
        id: generateId(),
        name: name.trim(),
        colorId,
        avatarId,
      },
    ]);

    setName("");
    setColorId("blue");
    setAvatarId("bird1");
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem",
        backgroundColor: "#fafafa",
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h1 style={{ textAlign: "center" }}>Players</h1>

        {/* Add player */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <input
            placeholder="Player name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ flex: "1 1 120px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <ColorPicker
            value={colorId}
            onChange={setColorId}
          />

          <select
            value={avatarId}
            onChange={e => setAvatarId(e.target.value as AvatarId)}
            style={{ flex: "1 1 120px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            {AVATAR_IDS.map(id => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <button
            onClick={addPlayer}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#4a7c59",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        {/* Player list */}
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          {players.map(p => (
            <li
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                justifyContent: "space-between",
                padding: "0.5rem 0.75rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img
                  src={AVATARS[p.avatarId]}
                  alt={p.name}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%" }}
                />
                <span
                  style={{
                    color: PLAYER_COLORS[p.colorId],
                    fontWeight: 600,
                    fontSize: "1.05rem",
                  }}
                >
                  {p.name}
                </span>
              </div>

              <button
                onClick={() => removePlayer(p.id)}
                style={{
                  padding: "0.3rem 0.6rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#c0392b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#aaa",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
