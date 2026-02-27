// components/auth/LoginModal.tsx
"use client";

import { useAuth } from "./AuthContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "./AuthForm";
import { useEffect } from "react";

// Smooth spring config matching app aesthetic
const smoothSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoginModalOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoginModalOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isLoginModalOpen, closeLoginModal]);

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLoginModal}
            className="absolute inset-0 bg-zinc-50/95 dark:bg-black/95 backdrop-blur-md"
          />

          {/* Subtle gradient orbs - matching homepage */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-teal-400/15 to-emerald-500/15 blur-[80px]"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-violet-400/10 to-purple-500/10 blur-[80px]"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
            transition={{ delay: 0.2, ...smoothSpring }}
            onClick={closeLoginModal}
            className="absolute right-6 top-6 z-20 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: 0.1, ...smoothSpring }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Card container */}
            <div className="mx-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl shadow-zinc-200/20 dark:shadow-zinc-900/40 p-8">
              <AuthForm mode="modal" />
            </div>

            {/* Bottom hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-4"
            >
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">Esc</kbd> to close
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
