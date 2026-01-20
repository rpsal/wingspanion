import { useState, useEffect } from "react";
import type { PlayerProfile } from "../domain/models";
import { getPlayers, savePlayer, deletePlayer } from "../services/persistence";
import { useAppState } from "../app/AppContext";

export default function PlayerSelector({
  selectedPlayers,
  setSelectedPlayers,
}: {
  selectedPlayers: PlayerProfile[];
  setSelectedPlayers: (players: PlayerProfile[]) => void;
}) {
  const { players, setPlayers } = useAppState();
  const [newName, setNewName] = useState("");

  // Load players from IndexedDB if AppContext is empty
  useEffect(() => {
    async function load() {
      if (players.length === 0) {
        const saved = await getPlayers();
        setPlayers(saved);
      }
    }
    load();
  }, [players, setPlayers]);

  // Add new player
  const addPlayer = async () => {
    if (!newName.trim()) return;
    const newPlayer: PlayerProfile = { id: `p-${Date.now()}`, name: newName.trim() };
    await savePlayer(newPlayer);
    setPlayers([...players, newPlayer]);
    setNewName("");
  };

  // Delete player
  const removePlayer = async (player: PlayerProfile) => {
    await deletePlayer(player.id);
    setPlayers(players.filter(p => p.id !== player.id));
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
  };

  // Toggle selection
  const toggleSelect = (player: PlayerProfile) => {
    setSelectedPlayers(
      selectedPlayers.includes(player)
        ? selectedPlayers.filter(p => p.id !== player.id)
        : [...selectedPlayers, player]
    );
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Players</h2>

      {/* Add new player */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="New player name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={addPlayer} style={{ marginLeft: "0.5rem" }}>
          Add
        </button>
      </div>

      {/* Player selection as checkboxes (like expansions) */}
      {players.length === 0 && <p>No players yet.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {players.map(player => (
          <label
            key={player.id}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={selectedPlayers.includes(player)}
              onChange={() => toggleSelect(player)}
              style={{ marginRight: "0.5rem" }}
            />
            {player.name}
            <button
              onClick={e => {
                e.stopPropagation(); // prevent toggling checkbox
                removePlayer(player);
              }}
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </label>
        ))}
      </div>
    </section>
  );
}
