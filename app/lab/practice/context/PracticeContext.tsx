// app/lab/practice/context/PracticeContext.tsx

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type DSAProblem, SHEET } from "../data/sheet";

// ── Types ──────────────────────────────────────────────────────────────────

export interface DrawerState {
  problemId: string;
  position: { x: number; y: number };
  originRect?: { top: number; left: number; width: number; height: number };
}

interface PracticeContextValue {
  // Static problem data
  topics: typeof SHEET;
  problemIndex: Map<string, DSAProblem>;

  // Floating drawer (openable from any mode)
  activeDrawer: DrawerState | null;
  openDrawer: (problemId: string, event?: React.MouseEvent) => void;
  closeDrawer: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────

const PracticeContext = createContext<PracticeContextValue | null>(null);

export function usePracticeContext(): PracticeContextValue {
  const ctx = useContext(PracticeContext);
  if (!ctx) {
    throw new Error("usePracticeContext must be used inside <PracticeProvider>");
  }
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<DrawerState | null>(null);

  // Build problem lookup map once
  const problemIndex = useMemo(() => {
    const map = new Map<string, DSAProblem>();
    SHEET.forEach((topic) => {
      topic.problems.forEach((p) => map.set(p.id, p));
    });
    return map;
  }, []);

  // event is optional — programmatic opens (TodaysFocus, Analyze links)
  // use viewport center as the animation origin
  const openDrawer = useCallback(
    (problemId: string, event?: React.MouseEvent) => {
      const position = event
        ? { x: event.clientX, y: event.clientY }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      let originRect: { top: number; left: number; width: number; height: number } | undefined;
      const target = (event?.currentTarget as HTMLElement) || (event?.target as HTMLElement)?.closest("button");
      if (target && typeof target.getBoundingClientRect === "function") {
        const rect = target.getBoundingClientRect();
        originRect = {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      }

      setActiveDrawer({ problemId, position, originRect });
    },
    [],
  );

  const closeDrawer = useCallback(() => setActiveDrawer(null), []);

  return (
    <PracticeContext.Provider
      value={{
        topics: SHEET,
        problemIndex,
        activeDrawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}