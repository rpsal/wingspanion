import { useRef } from "react";

type StepFn = (delta: number) => void;

export function useLongPressStepper(stepFn: StepFn, delta: number) {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  };

  const start = () => {
    stepFn(delta);

    timeoutRef.current = window.setTimeout(() => {
      let interval = 120;

      intervalRef.current = window.setInterval(() => {
        stepFn(delta);
      }, interval);

      // Accelerate after 1.5s
      window.setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(() => {
            stepFn(delta);
          }, 60);
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
