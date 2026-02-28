// components/auth/hooks/useAuthForm.ts
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";

export type AuthMode = "login" | "signup";

export interface PasswordStrength {
  score: number;   // 0-5
  label: string;
  color: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
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

export interface UseAuthFormReturn {
  mode: AuthMode;
  toggleMode: () => void;
  username: string;
  setUsername: (v: string) => void;
  usernameError: string;
  usernameValid: boolean;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  inviteCode: string;
  setInviteCode: (v: string) => void;
  inviteCodeError: string;
  formError: string;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSignUp: boolean;
}

export function useAuthForm(): UseAuthFormReturn {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Per-field errors
  const [usernameError, setUsernameError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [inviteCodeError, setInviteCodeError] = useState("");

  // Username validation (live)
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

  // Invite code validation (live — only show error after first blur / any input)
  useEffect(() => {
    if (!inviteCode) {
      setInviteCodeError("");
      return;
    }
    setInviteCodeError("");
  }, [inviteCode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    // Clear per-form state on switch
    setFormError("");
    setPassword("");
    setInviteCodeError("");
    setUsernameError("");
    setUsernameValid(false);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Guard: block if there are live validation errors
    if (usernameError || !username) {
      setUsernameError(username ? usernameError : "Username is required");
      return;
    }

    if (!inviteCode.trim()) {
      setInviteCodeError("Invite code is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await signup(username.trim(), inviteCode.trim(), password || undefined);
      } else {
        await login(username.trim(), inviteCode.trim(), password || undefined);
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mode,
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
    isSignUp: mode === "signup",
  };
}
