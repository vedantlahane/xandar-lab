// app/lab/layout.tsx

import LabSidebar from "./components/LabSidebar";
import LabProfile from "./components/LabProfile";
import { AuthProvider } from "@/components/auth/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { ThemeToggleWrapper } from "@/components/theme/ThemeToggleWrapper";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <AuthProvider>
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <LabSidebar />
        <LabProfile />

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
