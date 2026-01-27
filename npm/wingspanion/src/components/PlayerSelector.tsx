import { AVATARS } from "../domain/avatars";
import type { PlayerProfile } from "../domain/models";
import type { Dispatch, SetStateAction } from "react";
import { useAppState } from "../app/AppContext";
import { ColorPicker } from "./ColorPicker";
import { PLAYER_COLOR_IDS, PLAYER_COLORS } from "../domain/colors";
import type { PlayerColorId } from "../domain/colors";

type Props = {
  players: PlayerProfile[];
  selectedPlayerIds: string[];
  setSelectedPlayerIds: Dispatch<SetStateAction<string[]>>;
};

export default function PlayerSelector({
  players,
  selectedPlayerIds,
  setSelectedPlayerIds,
}: Props) {
  const { setPlayers, draftGame } = useAppState();

  const togglePlayer = (player: PlayerProfile) => {
    const isSelected = selectedPlayerIds.includes(player.id);

    if (isSelected) {
      setSelectedPlayerIds(prev => prev.filter(id => id !== player.id));
      return;
    }

    const currentSelectedPlayers = players.filter(p =>
      selectedPlayerIds.includes(p.id)
    );
    const usedColors = new Set(currentSelectedPlayers.map(p => p.colorId));

    let assignedColorId = player.colorId;
    if (usedColors.has(player.colorId)) {
      assignedColorId =
        PLAYER_COLOR_IDS.find(id => !usedColors.has(id)) ?? PLAYER_COLOR_IDS[0];
    }

    // Update the player color if needed
    if (assignedColorId !== player.colorId) {
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === player.id ? { ...p, colorId: assignedColorId } : p
        )
      );
    }

    setSelectedPlayerIds(prev => [...prev, player.id]);
  };

  const updatePlayerColor = (id: string, newColorId: PlayerColorId) => {
    if (draftGame) return;

    const otherSelectedPlayers = players.filter(
      p => selectedPlayerIds.includes(p.id) && p.id !== id
    );

    const colorAlreadyUsed = otherSelectedPlayers.some(
      p => p.colorId === newColorId
    );

    if (colorAlreadyUsed) {
      const nextAvailable = PLAYER_COLOR_IDS.find(
        id => !otherSelectedPlayers.some(p => p.colorId === id)
      );
      if (!nextAvailable) return; // all colors taken
      newColorId = nextAvailable;
    }

    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, colorId: newColorId } : p))
    );
  };

  const colorEditingDisabled = Boolean(draftGame);

  const selectedPlayers = players.filter(p =>
    selectedPlayerIds.includes(p.id)
  );

  const usedColorIds = new Set(selectedPlayers.map(p => p.colorId));

  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Select Players</h2>

      {(selectedPlayers.length < 2) && (
          <div style={{ fontSize: "0.85rem", color: "#c0392b", textAlign: "center" }}>
            Select 2–5 players to start
            <p></p>
          </div>
        )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        {players.map(player => {
          const selected = selectedPlayerIds.includes(player.id);

          return (
            <button
              key={player.id}
              onClick={() => togglePlayer(player)}
              style={{
                position: "relative",
                border: selected 
                  ? `2px solid ${PLAYER_COLORS[player.colorId]}` 
                  : "1px solid #ccc",
                borderRadius: "10px",
                padding: "0.75rem",
                background: selected ? "#f4fff7" : "white",
                cursor: "pointer",
              }}
            >
              {/* Color picker */}
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "6px",
                  left: "6px",
                }}
              >
                <ColorPicker
                  value={player.colorId}
                  disabled={colorEditingDisabled}
                  usedColorIds={usedColorIds}
                  onChange={(colorId: PlayerColorId) =>
                    updatePlayerColor(player.id, colorId)
                  }
                />
              </div>

              {/* Avatar */}
              <img
                src={AVATARS[player.avatarId]}
                alt={player.name}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  marginBottom: "0.5rem",
                }}
              />

              {/* Name */}
              <div
                style={{
                  fontWeight: 600,
                  color: PLAYER_COLORS[player.colorId]
                }}
              >
                {player.name}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
