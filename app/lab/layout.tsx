// app/lab/layout.tsx

import LabSidebar from "./components/LabSidebar";
import { AuthProvider } from "@/components/auth/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { ThemeToggleWrapper } from "@/components/ThemeToggleWrapper";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <AuthProvider>
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
          {/* Left Sidebar */}
          <LabSidebar />

          {/* Main Lab Content */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>

          {/* Theme Toggle - Bottom Right */}
          <ThemeToggleWrapper />

          {/* Global Login Modal */}
          <LoginModal />
        </div>
      </AuthProvider>

  );
}
