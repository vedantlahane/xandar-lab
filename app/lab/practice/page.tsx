// app/lab/practice/page.tsx — Browse mode

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { PracticeHeader } from "./components/PracticeHeader";
import { BrowseView } from "./components/browse/BrowseView";
import { usePracticeContext } from "./context/PracticeContext";

export default function PracticeBrowse() {
  const { isAuthenticated, openLoginModal, isLoading } = useAuth();
  const router = useRouter();
  const { openDrawer, activeDrawer } = usePracticeContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/lab?mode=login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const handleSelect = (id: string, e: React.MouseEvent) => {
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