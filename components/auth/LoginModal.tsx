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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginModal}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-[1px]" />

              {/* Modal Content */}
              <div className="relative bg-background rounded-2xl shadow-2xl shadow-violet-500/10 overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={closeLoginModal}
                  className="absolute right-4 top-4 z-20 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Form Container */}
                <div className="p-8 pt-12">
                  <AuthForm mode="modal" />
                </div>

                {/* Bottom Gradient */}
                <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
