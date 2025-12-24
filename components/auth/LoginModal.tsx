"use client";

import { useAuth } from "./AuthContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "./AuthForm";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 h-[600px] bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
          >
            <button
              onClick={closeLoginModal}
              className="absolute right-4 top-4 z-20 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <AuthForm mode="modal" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
