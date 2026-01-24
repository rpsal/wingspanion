import { useState } from "react";
import { useAppState } from "../app/AppContext";
import { AVATARS, AVATAR_IDS } from "../domain/avatars";
import { PLAYER_COLORS } from "../domain/colors";
import type { PlayerColorId } from "../domain/colors";
import type { AvatarId } from "../domain/avatars";
import { ColorPicker } from "../components/ColorPicker";

export default function PlayersPage() {
  const { players, setPlayers } = useAppState();

  const [name, setName] = useState("");
  const [colorId, setColorId] = useState<PlayerColorId>("blue");
  const [avatarId, setAvatarId] = useState<AvatarId>("bird1");

  const addPlayer = () => {
    if (!name.trim()) return;

    setPlayers([
      ...players,
      {
        id: crypto.randomUUID(),
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
    <div style={{ padding: "2rem", maxWidth: "480px", margin: "0 auto" }}>
      <h1>Players</h1>

      {/* Add player */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Player name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        {/* Color picker should emit PlayerColorId */}
        <ColorPicker
          value={colorId}
          onChange={setColorId}
        />

        <select
          value={avatarId}
          onChange={e => setAvatarId(e.target.value as AvatarId)}
        >
          {AVATAR_IDS.map(id => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        <button onClick={addPlayer}>Add</button>
      </div>

      {/* Player list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map(p => (
          <li
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
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
            <button onClick={() => removePlayer(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
