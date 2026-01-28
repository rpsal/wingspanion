import { useEffect, useRef } from "react";

type StepFn = () => void;

export function useLongPressStepper(stepFn: StepFn) {
  const stepRef = useRef(stepFn);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    stepRef.current = stepFn;
  }, [stepFn]);

  const clearTimers = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    stepRef.current();

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        stepRef.current();
      }, 120);

      window.setTimeout(() => {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(() => {
            stepRef.current();
          }, 60);
        }
      }, 1500);
    }, 300);
  };

  const stop = () => {
    clearTimers();
  };

  useEffect(() => clearTimers, []);

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  };
}
