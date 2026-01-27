import React from "react";

/* CSS Styles */
const sheetStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  background: "#f9f9f9",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  boxShadow: "0 -8px 24px rgba(0,0,0,0.15)",
  padding: "1rem",
  paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
  maxWidth: "520px",
  margin: "0 auto",
  touchAction: "manipulation",
};

const displayStyle: React.CSSProperties = {
  fontSize: "2.25rem",
  fontWeight: 700,
  textAlign: "center",
  padding: "0.75rem",
  marginBottom: "0.75rem",
  background: "white",
  borderRadius: "12px",
  border: "1px solid #ddd",
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  zIndex: 1000,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "0.5rem",
};

const keyStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
  padding: "1rem 0",
  borderRadius: "12px",
  background: "white",
  border: "1px solid #ccc",
  textAlign: "center",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
};

// const confirmKeyStyle = {
//   ...keyStyle,
//   background: "#4a7c59",
//   color: "white",
// };

// const deleteKeyStyle = {
//   ...keyStyle,
//   background: "#c94c4c",
//   color: "white",
// };

const actionBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  marginTop: "0.75rem",
};

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "1rem",
  fontSize: "1.1rem",
  fontWeight: 600,
  background: "#e0e0e0",
  color: "#333",
  border: "none",
  borderRadius: "12px",
};

const confirmButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "1rem",
  fontSize: "1.1rem",
  fontWeight: 700,
  background: "#4a7c59",
  color: "white",
  border: "none",
  borderRadius: "12px",
};




type ScoreKeypadProps = {
  initialValue: number;
  onConfirm: (value: number) => void;
  onCancel: () => void;
};

export function ScoreKeypad({
  initialValue,
  onConfirm,
  onCancel,
}: ScoreKeypadProps) {
  const [value, setValue] = React.useState(String(initialValue));

  const press = (key: string) => {
    //haptic("light");

    if (key === "C") return setValue("");
    if (key === "←") return setValue(v => v.slice(0, -1));
    if (key === "-" && value.startsWith("-")) return;
    if (key === "-" && value.length > 0) return;

    setValue(v => v + key);
  };

  return (
    <div style={sheetStyle}>
      <div style={displayStyle}>{value || "0"}</div>

      <div style={gridStyle}>
        {["1","2","3","4","5","6","7","8","9","-","0","←"].map(k => (
          <button
            key={k}
            onClick={() => press(k)}
            style={keyStyle}
          >
            {k}
          </button>
        ))}
      </div>

      <div style={actionBarStyle}>
        <button
            style={cancelButtonStyle}
            onClick={onCancel}
        >
        Cancel
        </button>
        <button
            style={confirmButtonStyle}
            onClick={() => onConfirm(Number(value || 0))}
        >
        OK
        </button>
      </div>
    </div>
  );
}
