// components/auth/ui/FormField.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface FormFieldProps {
  icon: React.ElementType;
  label: string;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
}

export function FormField({ icon: Icon, label, error, success, children }: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>

      <div className="relative">
        {children}
        <AnimatePresence>
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <Check className="h-4 w-4 text-emerald-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive flex items-center gap-1"
          >
            <X className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
