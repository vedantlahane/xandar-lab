// app/lab/practice/components/PracticeHeader.tsx
"use client";

import type { ReactNode } from "react";
import { ModuleHeader, type ModeConfig } from "@/app/lab/components/shared/ModuleHeader";

const MODES: ModeConfig[] = [
  { href: "/lab/practice", label: "Browse", exact: true },
  { href: "/lab/practice/focus", label: "Focus" },
  { href: "/lab/practice/analyze", label: "Analyze" },
  { href: "/lab/practice/interview", label: "Interview" },
];

export function PracticeHeader({ children }: { children?: ReactNode }) {
  return (
    <ModuleHeader modes={MODES} activeLayoutId="activePracticeMode">
      {children}
    </ModuleHeader>
  );
}
