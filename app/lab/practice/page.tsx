// app/lab/practice/page.tsx — Browse mode

"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { PracticeHeader } from "./components/PracticeHeader";
import { BrowseView } from "./components/browse/BrowseView";
import { usePracticeContext } from "./context/PracticeContext";

export default function PracticeBrowse() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { openDrawer, activeDrawer } = usePracticeContext();

  const handleSelect = (id: string, e: React.MouseEvent) => {
    // Defensive — template.tsx already guards auth,
    // but this prevents drawer open if auth expires mid-session
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    openDrawer(id, e);
  };

  return (
    <>
      {/* Header: mode pills only — SearchBar lives inside BrowseView */}
      <PracticeHeader />

      {/* Browse content — owns the two-column grid + topic sidebar */}
      <div className="flex-1 overflow-hidden">
        <BrowseView
          activeProblemId={activeDrawer?.problemId ?? null}
          onProblemSelect={handleSelect}
        />
      </div>
    </>
  );
}