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

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PracticeTemplate({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/lab?mode=login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Reserve header space during auth check so the mode switcher
  // area doesn't flash empty → content
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <div className="h-12 flex-shrink-0 border-b border-border/40" />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // No exit — template unmounting via Next.js navigation doesn't trigger
      // Framer exit animations (would need AnimatePresence wrapping conditional render)
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}