"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, X, Eye, EyeOff, Shield, User, Lock, Key } from "lucide-react";
import { cn } from "@/lib/utils";

// Smooth spring config matching app aesthetic
const smoothSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

// Password strength calculator
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" };
  return { score: 5, label: "Very Strong", color: "bg-teal-500" };
}

// Animated input field wrapper
function FormField({
  icon: Icon,
  label,
  error,
  success,
  children,
}: {
  icon: React.ElementType;
  label: string;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
}) {
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
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
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
            <X className="h-3 w-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Password strength indicator
function PasswordStrengthIndicator({ password }: { password: string }) {
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
        Password strength: <span className={cn(
          "font-medium",
          strength.score <= 1 && "text-red-500",
          strength.score === 2 && "text-orange-500",
          strength.score === 3 && "text-yellow-600 dark:text-yellow-500",
          strength.score === 4 && "text-emerald-500",
          strength.score === 5 && "text-teal-500"
        )}>{strength.label}</span>
      </p>
    </motion.div>
  );
}

export function AuthForm({ mode = "page", align = "center" }: { mode?: "page" | "modal", align?: "center" | "left" }) {
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation states
  const [usernameError, setUsernameError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);

  // Username validation
  useEffect(() => {
    if (!username) {
      setUsernameError("");
      setUsernameValid(false);
      return;
    }

    if (username.length < 3) {
      setUsernameError("At least 3 characters");
      setUsernameValid(false);
    } else if (username.length > 20) {
      setUsernameError("Maximum 20 characters");
      setUsernameValid(false);
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Only letters, numbers, and underscores");
      setUsernameValid(false);
    } else {
      setUsernameError("");
      setUsernameValid(true);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (usernameError) return;

    setLoading(true);

    try {
      if (isSignUp) {
        await signup(username, inviteCode, password || undefined);
      } else {
        await login(username, inviteCode, password || undefined);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const alignmentClass = align === "center" ? "text-center" : "text-left";
  const containerClass = align === "center" ? "mx-auto" : "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={smoothSpring}
      className={`w-full max-w-sm space-y-6 px-4 ${containerClass}`}
    >
      {/* Header */}
      <div className={`${alignmentClass} space-y-2`}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ...smoothSpring }}
          className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 mx-auto mb-4"
        >
          <Shield className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          {isSignUp
            ? "Enter your details to join the lab"
            : "Please identify yourself to continue"}
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          icon={User}
          label="Username"
          error={usernameError}
          success={usernameValid}
        >
          <Input
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            autoComplete="username"
            className={cn(
              "bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11",
              usernameError && "border-destructive focus-visible:border-destructive",
              usernameValid && "border-emerald-500/50 focus-visible:border-emerald-500"
            )}
          />
        </FormField>

        <FormField
          icon={Lock}
          label={isSignUp ? "Password (optional)" : "Password"}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {isSignUp && password && (
              <PasswordStrengthIndicator password={password} />
            )}
          </AnimatePresence>
        </FormField>

        <FormField icon={Key} label="Invite Code">
          <Input
            type="password"
            placeholder="••••"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
            className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11"
          />
        </FormField>

        {/* Remember Me */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={cn(
              "h-4 w-4 rounded border transition-all duration-200 flex items-center justify-center",
              rememberMe
                ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100"
                : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
            )}
          >
            {rememberMe && (
              <Check className="h-3 w-3 text-white dark:text-zinc-900" />
            )}
          </button>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Remember me for 7 days
          </span>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2"
            >
              <p className="text-xs text-destructive font-medium text-center">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button
            type="submit"
            className="w-full h-11 font-medium"
            disabled={loading || !!usernameError}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              isSignUp ? "Create Account" : "Enter Lab"
            )}
          </Button>
        </motion.div>
      </form>

      {/* Toggle signup/login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={alignmentClass}
      >
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setUsernameError("");
          }}
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>
      </motion.div>
    </motion.div>
  );
}
