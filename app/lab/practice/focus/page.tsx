// app/lab/practice/focus/page.tsx — Focus mode

"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { PracticeHeader } from "../components/PracticeHeader";
import { FocusView } from "../components/focus/FocusView";
import { TimerDisplay } from "../components/shared/Timer";
import { useTimer } from "../hooks/useTimer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * Focus mode — no distractions, one problem at a time.
 *
 * The timer lives here (in the header right slot) so it's always visible.
 * FocusView receives the timer handle for pausing on solve/quit.
 */
export default function PracticeFocusPage() {
  const router = useRouter();
  const timer = useTimer();

  return (
    <>
      {/* Header: mode pills + timer + exit */}
      <PracticeHeader>
        <TimerDisplay timer={timer} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/lab/practice")}
          className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <X size={14} />
          <span className="text-xs">Exit</span>
        </Button>
      </PracticeHeader>

      {/* Focus content — full remaining height */}
      <div className="flex-1 overflow-hidden">
        {/*
          Suspense is required because FocusView calls useSearchParams()
          which requires a Suspense boundary in Next.js App Router.
        */}
        <Suspense fallback={null}>
          <FocusView timer={timer} />
        </Suspense>
      </div>
    </>
  );
}
