"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";

export default function LabHome() {
  const { user, logout, isAuthenticated } = useAuth();

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
    <div className="flex h-screen items-center justify-center bg-zinc-50 text-zinc-800">
      <div className="space-y-3 text-center">
        <p className="text-sm text-zinc-500">Navigation lives in the lab sidebar.</p>
        <h1 className="text-2xl font-semibold">
            {isAuthenticated ? `Welcome, ${user?.username}` : "Open the menu to choose a module."}
        </h1>
        <p className="text-sm text-zinc-500">Practice is live; notes, docs, and experiments are staged.</p>
        
        <div className="pt-4 flex gap-2 justify-center">
            {isAuthenticated && (
                <>
                    <Button variant="outline" onClick={handleSeed} size="sm">
                        Sync Database
                    </Button>
                    <Button variant="destructive" onClick={logout} size="sm">
                        Logout
                    </Button>
                </>
            )}
        </div>
      </div>
    </div>
  );
}
