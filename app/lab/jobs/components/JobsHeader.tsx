// app/lab/jobs/components/JobsHeader.tsx
"use client";

import type { ReactNode } from "react";
import { ModuleHeader, type ModeConfig } from "@/app/lab/components/shared/ModuleHeader";

const MODES: ModeConfig[] = [
  { href: "/lab/jobs", label: "Jobs", exact: true },
  { href: "/lab/jobs/portals", label: "Portals" },
];

export function JobsHeader({ children }: { children?: ReactNode }) {
  return (
    <ModuleHeader modes={MODES} activeLayoutId="activeJobsMode">
      {children}
    </ModuleHeader>
  );
}
