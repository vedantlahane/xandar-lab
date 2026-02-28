// app/lab/practice/components/focus/FocusView.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { usePracticeContext } from "../../context/PracticeContext";
import { FocusEmpty } from "./FocusEmpty";
import { FocusCard } from "./FocusCard";
import type { TimerHandle } from "../../hooks/useTimer";

interface FocusViewProps {
  timer: TimerHandle;
}

/**
 * Reads the ?p=<problemId> URL param to decide what to show:
 * - No param → <FocusEmpty> (pick a problem)
 * - Valid param → <FocusCard> (focused work session)
 */
export function FocusView({ timer }: FocusViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { problemIndex } = usePracticeContext();

  const problemId = searchParams.get("p");
  const problem = problemId ? problemIndex.get(problemId) ?? null : null;

  const handleSolved = (_id: string) => {
    // After save, go back to Browse (could open reflection card here later)
    router.push("/lab/practice");
  };

  const handleGaveUp = (_id: string) => {
    router.push("/lab/practice/focus");
  };

  if (!problem) {
    return <FocusEmpty />;
  }

  return (
    <FocusCard
      problem={problem}
      timer={timer}
      onSolved={handleSolved}
      onGaveUp={handleGaveUp}
    />
  );
}
