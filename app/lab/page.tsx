"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LabHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("lab_user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, inviteCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("lab_user", JSON.stringify(data.user));
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 text-zinc-800">
        <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-sm border border-zinc-200">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Xandar Lab Access</h1>
            <p className="text-sm text-zinc-500">Enter your invite code to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Enter Lab"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 text-zinc-800">
      <div className="space-y-3 text-center">
        <p className="text-sm text-zinc-500">Navigation lives in the lab sidebar.</p>
        <h1 className="text-2xl font-semibold">Welcome, {JSON.parse(localStorage.getItem("lab_user") || "{}").username}</h1>
        <p className="text-sm text-zinc-500">Practice is live; notes, docs, and experiments are staged.</p>
        
        <div className="pt-4">
            <Button variant="outline" onClick={handleSeed} size="sm">
                Sync Database with Sheet
            </Button>
        </div>
      </div>
    </div>
  );
}
