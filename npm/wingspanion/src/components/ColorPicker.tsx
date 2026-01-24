import { useState, useRef, useEffect } from "react";
import { PLAYER_COLORS } from "../domain/colors";
import type { PlayerColorId } from "../domain/colors";

const COLOR_IDS: PlayerColorId[] = [
  "blue",
  "red",
  "green",
  "yellow",
  "purple",
  "black",
  "white",
];

interface ColorPickerProps {
  value: PlayerColorId;
  disabled?: boolean;
  onChange: (colorId: PlayerColorId) => void;
}

export function ColorPicker({
  value,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close callout on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close if disabled
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Selected color button */}
      <button
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: PLAYER_COLORS[value],
          border: "2px solid #333",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      />

      {/* Callout */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            display: "flex",
            gap: "0.4rem",
            padding: "0.4rem",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          {COLOR_IDS.map((id) => (
            <button
              key={id}
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: PLAYER_COLORS[id],
                border:
                  value === id ? "2px solid #333" : "1px solid #ccc",
                cursor: "pointer",
              }}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
