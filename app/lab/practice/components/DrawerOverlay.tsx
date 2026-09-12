// app/lab/practice/components/DrawerOverlay.tsx

"use client";

import { AnimatePresence } from "framer-motion";
import { usePracticeContext } from "../context/PracticeContext";
import { ProblemDrawer } from "./ProblemDrawer";

/**
 * Renders the floating ProblemDrawer above all mode content.
 * Reads activeDrawer state from PracticeContext so it can be triggered
 * from any mode (Browse, Analyze, deep-link, etc.).
 *
 * Placed at the practice/layout.tsx level — always mounted.
 */
export function DrawerOverlay() {
  const { activeDrawer, closeDrawer, problemIndex } = usePracticeContext();

  const problem = activeDrawer
    ? (problemIndex.get(activeDrawer.problemId) ?? null)
    : null;

  return (
    <AnimatePresence>
      {activeDrawer && problem && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <ProblemDrawer
            key={activeDrawer.problemId}
            problem={problem}
            position={activeDrawer.position}
            onClose={closeDrawer}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
