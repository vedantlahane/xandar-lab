"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function AuthForm({ mode = "page", align = "center" }: { mode?: "page" | "modal", align?: "center" | "left" }) {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, inviteCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const alignmentClass = align === "center" ? "text-center" : "text-left";
  const containerClass = align === "center" ? "mx-auto" : "";

  return (
    <div className={`w-full max-w-sm space-y-8 px-4 ${containerClass}`}>
        <div className={`${alignmentClass} space-y-2`}>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSignUp ? "Create Account" : "Restricted Access"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Enter your details to join the lab" : "Please identify yourself to continue."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive text-center font-medium">
              {error}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full h-11" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Sign Up" : "Enter Lab"}
          </Button>
        </form>

        <div className={alignmentClass}>
            <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </button>
        </div>
    </div>
  );
}
