// app/lab/practice/template.tsx
//
// Next.js "template" file — re-mounts on EVERY navigation (unlike layout which persists).
// Used here for two things:
//   1. Smooth 150ms fade-in when switching between Practice modes
//   2. Centralized auth guard — all four modes (Browse/Focus/Analyze/Interview)
//      are protected from this single point. No mode page needs its own auth check.
//
// Why template instead of layout:
//   layout.tsx persists across navigations (provider + overlay stay alive)
//   template.tsx re-renders and its children re-mount on each navigation
//   → This gives us the fade-in animation without dismounting the provider,
//     AND re-checks auth on every mode switch.

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SPATIAL_EASING, DURATION_MICRO } from "@/lib/spatial/constants";

export default function PracticeTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden min-h-0"
      initial={{ opacity: 0.9, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION_MICRO, ease: SPATIAL_EASING }}
    >
      {children}
    </motion.div>
  );
}