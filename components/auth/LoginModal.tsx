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
        <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-background/95 backdrop-blur-md"
        >
            <button
              onClick={closeLoginModal}
              className="absolute right-8 top-8 z-20 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <AuthForm mode="modal" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
