// app/lab/practice/layout.tsx

import { PracticeProvider } from "./context/PracticeContext";
import { DrawerOverlay } from "./components/DrawerOverlay";

/**
 * Practice layout — wraps all four modes (Browse / Focus / Analyze / Interview).
 *
 * Responsibilities:
 *  1. Provides PracticeProvider context (shared data + drawer state)
 *  2. Renders DrawerOverlay (floating ProblemDrawer, triggerable from any mode)
 *  3. Gives each mode page full height below the fixed lab chrome
 *
 * NOT responsible for:
 *  - The mode switcher header (each page renders <PracticeHeader> itself)
 *  - Any specific layout grid (each mode owns 100% of its space)
 */
export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PracticeProvider>
      {/* Full-height container — modes are flex columns that fill this */}
      <div className="relative h-screen flex flex-col bg-background text-foreground overflow-hidden">
        {/* Mode content — each child renders <PracticeHeader> + its own layout */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {children}
        </div>

        {/* Floating drawer overlay — above all mode content, triggered from context */}
        <DrawerOverlay />
      </div>
    </PracticeProvider>
  );
}
