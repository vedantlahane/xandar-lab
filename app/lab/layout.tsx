import LabSidebar from "./components/LabSidebar";
import LabProfile from "./components/LabProfile";
import { MobileNav } from "./components/MobileNav";
import { AuthProvider } from "@/components/auth/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { ThemeToggleWrapper } from "@/components/theme/ThemeToggleWrapper";
import { SpatialPageContainer } from "@/components/spatial/SpatialPageContainer";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        {/* Desktop Sidebar & Widgets (>= 768px) */}
        <div className="hidden md:block">
          <LabSidebar />
          <LabProfile />
          <ThemeToggleWrapper />
        </div>

        {/* Dedicated Non-Overlapping Mobile Navigation (< 768px) */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Main Lab Content with Spatial Surface Reconfiguration */}
        <main className="flex-1 overflow-hidden">
          <SpatialPageContainer>
            {children}
          </SpatialPageContainer>
        </main>

        {/* Global Login Modal */}
        <LoginModal />
      </div>
    </AuthProvider>
  );
}
