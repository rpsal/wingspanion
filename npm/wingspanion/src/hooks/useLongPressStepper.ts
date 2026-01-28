import { useRef } from "react";

type StepFn = () => void;

export function useLongPressStepper(stepFn: StepFn) {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    stepFn();

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(stepFn, 120);

      window.setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(stepFn, 60);
        }
      }, 1500);
    }, 300);
  };

  const stop = () => {
    clearTimers();
  };

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  };
}
