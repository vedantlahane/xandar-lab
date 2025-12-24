"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function LabHome() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
      if (searchParams.get("mode") === "login" && !isAuthenticated) {
          setShowLogin(true);
      }
  }, [searchParams, isAuthenticated]);

  const handleCancel = () => {
      setShowLogin(false);
      router.push("/lab");
  };

  const handleSeed = async () => {
      try {
          const res = await fetch("/api/seed", { method: "POST" });
          const data = await res.json();
          alert(data.message || data.error);
      } catch (e) {
          alert("Failed to seed");
      }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-800 dark:bg-black dark:text-zinc-200 p-4">
      <motion.div 
          layout 
          className={`w-full transition-all duration-500 ease-in-out ${showLogin ? "max-w-4xl" : "max-w-md"}`}
       >
          <div className={`flex ${showLogin ? "flex-row items-center gap-12" : "flex-col items-center gap-8"}`}>
             
             {/* Left Column (Text) */}
             <motion.div 
                layout 
                className={`flex flex-col ${showLogin ? "flex-1 items-end text-right" : "w-full items-center text-center"}`}
             >
                <div className="space-y-2">
                    <p className="text-sm text-zinc-500">Navigation lives in the lab sidebar.</p>
                    {isAuthenticated ? (
                        <h1 className="text-2xl font-semibold">
                            Welcome, {user?.username}
                        </h1>
                    ) : (
                        <h1 className="text-2xl font-semibold">
                            Xandar Lab
                        </h1>
                    )}
                    <p className="text-sm text-zinc-500">Practice is live; notes, docs, and experiments are staged.</p>
                </div>

                {/* Logged In Buttons */}
                {isAuthenticated && (
                    <div className="pt-4 flex gap-2">
                        <Button variant="outline" onClick={handleSeed} size="sm">
                            Sync Database
                        </Button>
                        <Button variant="destructive" onClick={logout} size="sm">
                            Logout
                        </Button>
                    </div>
                )}
             </motion.div>

             {/* Right Column (Form) */}
             <AnimatePresence>
                {!isAuthenticated && showLogin && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1 w-full"
                    >
                        <AuthForm align="left" />
                        <div className="mt-4 text-left">
                             <button onClick={handleCancel} className="text-xs text-zinc-500 hover:underline">
                                Cancel
                             </button>
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>

          </div>
       </motion.div>
    </div>
  );
}
