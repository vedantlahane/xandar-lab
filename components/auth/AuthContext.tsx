// components/auth/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Private fetch helper — shared by login() and signup() to eliminate duplication
// ---------------------------------------------------------------------------
async function authenticate(
  isSignUp: boolean,
  username: string,
  inviteCode: string,
  password?: string
): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, inviteCode, password, isSignUp }),
  });

  if (!res.ok) {
    let message = isSignUp ? "Signup failed" : "Login failed";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      message = `Server error (${res.status})`;
    }
    throw new Error(message);
  }

  const data = await res.json();
  return data.user as User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("lab_user", JSON.stringify(data.user));
        } else {
          // Server says no session — clear stale localStorage to prevent
          // the "half-authenticated" state (localStorage present, cookie gone)
          localStorage.removeItem("lab_user");
          setUser(null);
        }
      }
    } catch {
      // Network error only — fall back to localStorage (offline support)
      const stored = localStorage.getItem("lab_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem("lab_user");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Shared post-auth setter used by both login and signup
  const setAuthUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("lab_user", JSON.stringify(userData));
    setIsLoginModalOpen(false);
  };

  const login = async (username: string, inviteCode: string, password?: string) => {
    const userData = await authenticate(false, username, inviteCode, password);
    setAuthUser(userData);
  };

  const signup = async (username: string, inviteCode: string, password?: string) => {
    const userData = await authenticate(true, username, inviteCode, password);
    setAuthUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Always clear local auth regardless of network failure
    } finally {
      setUser(null);
      localStorage.removeItem("lab_user");
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("lab_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshSession,
        updateUser,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
