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

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <SessionProvider>
      <AuthContextProvider isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}

function AuthContextProvider({ children, isLoginModalOpen, setIsLoginModalOpen }: { children: React.ReactNode, isLoginModalOpen: boolean, setIsLoginModalOpen: (v: boolean) => void }) {
  const { data: session, status, update } = useSession()

  const login = async (username: string, inviteCode: string, password?: string) => {
    const res = await signIn("credentials", {
      username, password, inviteCode,
      redirect: false
    })
    if (res?.error) throw new Error(res.error)
    setIsLoginModalOpen(false)
  };

  const signup = async (username: string, inviteCode: string, password?: string) => {
    const res = await signIn("credentials", {
      username, password, inviteCode, isSignUp: 'true',
      redirect: false
    })
    if (res?.error) throw new Error(res.error)
    setIsLoginModalOpen(false)
  };

  const logout = async () => {
    await signOut({ redirect: false })
  };

  const updateUser = async (updates: Partial<User>) => {
    await update(updates)
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user as any,
        isAuthenticated: !!session?.user,
        isLoading: status === "loading",
        login,
        signup,
        logout,
        refreshSession: async () => { await update(); },
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
