import React from "react";
import { useLongPressStepper } from "../hooks/useLongPressStepper";
// import { useStepSound } from "../hooks/useStepSound";
// import { haptic } from "../utils/haptic";

const buttonStyle: React.CSSProperties = {
  width: "64px",
  height: "64px",
  fontSize: "2rem",
  fontWeight: 600,
  borderRadius: "16px",
  border: "1px solid #ccc",
  background: "#fff",
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
};

const valueStyle: React.CSSProperties = {
  minWidth: "80px",
  textAlign: "center",
  fontSize: "2.5rem",
  fontWeight: 600,
  userSelect: "none",
};

type ScoreStepperProps = {
  value: number;
  onChange: (next: number) => void;
  onDirectInput?: (current: number) => void;
  min?: number;
  max?: number;
  step?: number;
  fastStep?: number;
  disabled?: boolean;
};

export function ScoreStepper({
  value,
  onChange,
  onDirectInput,
  min = -Infinity,
  max = Infinity,
  step = 1,
  fastStep = 10,
  disabled = false,
}: ScoreStepperProps) {
  //const playSound = useStepSound();

  const applyDelta = (delta: number) => {
    if (disabled) return;

    const next = Math.min(max, Math.max(min, value + delta));
    if (next === value) return;

    onChange(next);
    //haptic("light");
    //playSound();
  };

  const inc = useLongPressStepper(() => applyDelta(step));
  const dec = useLongPressStepper(() => applyDelta(-step));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
        maxWidth: "360px",
        margin: "0 auto",
        touchAction: "none",
      }}
    >
      <button
        disabled={disabled || value <= min}
        onClick={() => onChange(value - fastStep)}
        style={buttonStyle}
        tabIndex={-1}
      >
        &lt;&lt;
      </button>
      <button
        {...dec}
        disabled={disabled || value <= min}
        aria-label="Decrease score"
        style={buttonStyle}
        tabIndex={-1}
      >
        &lt;
      </button>

      <div
        style={valueStyle}
        onClick={() => onDirectInput?.(value)}
      >
        {value}
      </div>

      <button
        {...inc}
        disabled={disabled || value >= max}
        aria-label="Increase score"
        style={buttonStyle}
        tabIndex={-1}
      >
        &gt;
      </button>
      <button
        disabled={disabled || value >= max}
        onClick={() => onChange(value + fastStep)}
        style={buttonStyle}
        tabIndex={-1}
      >
        &gt;&gt;
      </button>
    </div>
  );
}
