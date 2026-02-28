// components/auth/ui/PasswordStrengthIndicator.tsx
"use client";

import { motion } from "framer-motion";
import { getPasswordStrength } from "@/components/auth/hooks/useAuthForm";
import { cn } from "@/lib/utils";

const smoothSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password);
  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-1.5 pt-1"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              level <= strength.score
                ? strength.color
                : "bg-zinc-200 dark:bg-zinc-800"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: level * 0.05, ...smoothSpring }}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Password strength:{" "}
        <span
          className={cn(
            "font-medium",
            strength.score <= 1 && "text-red-500",
            strength.score === 2 && "text-orange-500",
            strength.score === 3 && "text-yellow-600 dark:text-yellow-500",
            strength.score === 4 && "text-emerald-500",
            strength.score === 5 && "text-teal-500"
          )}
        >
          {strength.label}
        </span>
      </p>
    </motion.div>
  );
}
