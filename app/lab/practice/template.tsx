// app/lab/practice/template.tsx
//
// Next.js "template" file — re-mounts on EVERY navigation (unlike layout which persists).
// Used here to add a smooth 150ms crossfade when switching between Practice modes.
//
// Why template instead of layout:
//   layout.tsx persists across navigations (provider + overlay stay alive)
//   template.tsx re-renders and its children re-mount on each navigation
//   → This gives us the fade-in animation without dismounting the provider.

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PracticeTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
