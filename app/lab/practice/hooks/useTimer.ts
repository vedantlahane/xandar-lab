// app/lab/practice/hooks/useTimer.ts

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface TimerHandle {
  seconds: number;
  formatted: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
}

export function useTimer(autoStart = false): TimerHandle {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((r) => !r), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(
        () => setSeconds((s) => s + 1),
        1000,
      );
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatted = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  return { seconds, formatted, isRunning, start, pause, toggle, reset };
}
