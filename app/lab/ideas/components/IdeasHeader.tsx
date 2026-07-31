// app/lab/ideas/components/IdeasHeader.tsx
"use client";

import type { ReactNode } from "react";
import { ModuleHeader, type ModeConfig } from "@/app/lab/components/shared/ModuleHeader";

const MODES: ModeConfig[] = [
  { 
    href: "/lab/ideas", 
    label: "Catalog", 
    match: (pathname) => pathname === "/lab/ideas" || (pathname.startsWith("/lab/ideas/") && !pathname.includes("/forge")) 
  },
  { href: "/lab/ideas/forge", label: "Forge" },
];

export function IdeasHeader({ children }: { children?: ReactNode }) {
  return (
    <ModuleHeader modes={MODES} activeLayoutId="activeIdeasMode">
      {children}
    </ModuleHeader>
  );
}
