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
}

interface PracticeContextValue {
  // Static problem data
  topics: typeof SHEET;
  problemIndex: Map<string, DSAProblem>;

  // Floating drawer (openable from any mode)
  activeDrawer: DrawerState | null;
  openDrawer: (problemId: string, event?: React.MouseEvent) => void;
  closeDrawer: () => void;

  // Cross-mode problem selection (Browse → Focus entry)
  // NOTE: Currently unused — Focus reads problem from URL params (bookmarkable, shareable).
  // Keep for potential flows where URL isn't appropriate (e.g., multi-problem queue).
  // Remove if no concrete use case emerges by the time Interview mode ships.
  selectedProblemId: string | null;
  selectProblem: (id: string | null) => void;
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
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

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
      setActiveDrawer({ problemId, position });
    },
    [],
  );

  const closeDrawer = useCallback(() => setActiveDrawer(null), []);

  const selectProblem = useCallback((id: string | null) => {
    setSelectedProblemId(id);
  }, []);

  return (
    <PracticeContext.Provider
      value={{
        topics: SHEET,
        problemIndex,
        activeDrawer,
        openDrawer,
        closeDrawer,
        selectedProblemId,
        selectProblem,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}