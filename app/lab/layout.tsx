import LabSidebar from "@/components/LabSidebar";

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* Left Sidebar */}
      <LabSidebar />

      {/* Main Lab Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
