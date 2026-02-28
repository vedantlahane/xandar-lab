// components/auth/AuthForm.tsx
"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, Shield, User, Lock, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/auth/ui/FormField";
import { PasswordStrengthIndicator } from "@/components/auth/ui/PasswordStrengthIndicator";
import { useAuthForm } from "@/components/auth/hooks/useAuthForm";

const smoothSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

export function AuthForm({
  mode = "page",
  align = "center",
}: {
  mode?: "page" | "modal";
  align?: "center" | "left";
}) {
  const {
    isSignUp,
    toggleMode,
    username,
    setUsername,
    usernameError,
    usernameValid,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    inviteCode,
    setInviteCode,
    inviteCodeError,
    formError,
    isSubmitting,
    handleSubmit,
  } = useAuthForm();

  // Auto-focus username on mount
  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const alignClass = align === "center" ? "text-center" : "text-left";
  const wrapClass = align === "center" ? "mx-auto" : "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={smoothSpring}
      className={`w-full max-w-sm space-y-6 px-4 ${wrapClass}`}
    >
      {/* Header */}
      <div className={`${alignClass} space-y-2`}>
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
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Username */}
        <FormField icon={User} label="Username" error={usernameError} success={usernameValid}>
          <Input
            ref={usernameRef}
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

        {/* Password */}
        <FormField
          icon={Lock}
          label={isSignUp ? "Password (optional)" : "Password"}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11 pr-10"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <AnimatePresence>
            {isSignUp && password && <PasswordStrengthIndicator password={password} />}
          </AnimatePresence>
        </FormField>

        {/* Invite Code */}
        <FormField icon={Key} label="Invite Code" error={inviteCodeError}>
          <Input
            type="password"
            placeholder="â€¢â€¢â€¢â€¢"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
            autoComplete="one-time-code"
            className={cn(
              "bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11",
              inviteCodeError && "border-destructive focus-visible:border-destructive"
            )}
          />
        </FormField>

        {/* Form-level error */}
        <AnimatePresence>
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2"
            >
              <p className="text-xs text-destructive font-medium text-center">{formError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            className="w-full h-11 font-medium"
            disabled={isSubmitting || !!usernameError}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Enter Lab"
            )}
          </Button>
        </motion.div>
      </form>

      {/* Toggle login â†” signup */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={alignClass}
      >
        <button
          type="button"
          onClick={toggleMode}
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
