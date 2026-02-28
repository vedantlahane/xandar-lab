// app/lab/practice/components/shared/Timer.tsx

"use client";

import { Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TimerHandle } from "../../hooks/useTimer";

interface TimerDisplayProps {
  timer: TimerHandle;
  className?: string;
}

/**
 * Compact timer display for the PracticeHeader right slot.
 * Shows formatted time + a blinking dot when running.
 * Click to toggle pause/resume.
 */
export function TimerDisplay({ timer, className }: TimerDisplayProps) {
  return (
    <button
      onClick={timer.toggle}
      className={cn(
        "flex items-center gap-1.5 text-sm font-mono",
        "text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
      title={timer.isRunning ? "Pause timer" : "Resume timer"}
    >
      {timer.isRunning ? <Pause size={13} /> : <Play size={13} />}
      <span>{timer.formatted}</span>
      {timer.isRunning && (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 w-1.5 rounded-full bg-foreground/60"
        />
      )}
    </button>
  );
}