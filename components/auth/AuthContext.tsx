"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  username: string;
  _id: string;
  email?: string;
  bio?: string;
  savedProblems?: string[];
  completedProblems?: string[];
  createdAt?: string;
  lastLoginAt?: string;
  hasPassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, inviteCode: string, password?: string) => Promise<void>;
  signup: (username: string, inviteCode: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check session on mount
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          // Also update localStorage as backup
          localStorage.setItem("lab_user", JSON.stringify(data.user));
        } else {
          // Check localStorage fallback
          const storedUser = localStorage.getItem("lab_user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              localStorage.removeItem("lab_user");
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem("lab_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
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

  const login = async (username: string, inviteCode: string, password?: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ username, inviteCode, password, isSignUp: false }),
    });

    if (!res.ok) {
      let errorMessage = "Login failed";
      try {
        const data = await res.json();
        errorMessage = data.error || errorMessage;
      } catch {
        errorMessage = `Server error (${res.status})`;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("lab_user", JSON.stringify(data.user));
    setIsLoginModalOpen(false);
  };

  const signup = async (username: string, inviteCode: string, password?: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ username, inviteCode, password, isSignUp: true }),
    });

    if (!res.ok) {
      let errorMessage = "Signup failed";
      try {
        const data = await res.json();
        errorMessage = data.error || errorMessage;
      } catch {
        errorMessage = `Server error (${res.status})`;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("lab_user", JSON.stringify(data.user));
    setIsLoginModalOpen(false);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("lab_user");
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("lab_user", JSON.stringify(updatedUser));
    }
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
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
