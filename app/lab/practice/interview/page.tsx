// app/lab/practice/interview/page.tsx — Interview mode

"use client";

import { PracticeHeader } from "../components/PracticeHeader";
import { InterviewManager } from "../components/interview/InterviewManager";

export default function PracticeInterviewPage() {
  return (
    <>
      {/* Header: mode pills only (interview-specific controls live in the session page) */}
      <PracticeHeader />

      {/* Interview content */}
      <div className="flex-1 overflow-hidden">
        <InterviewManager />
      </div>
    </>
  );
}
