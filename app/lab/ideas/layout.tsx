// app/lab/ideas/layout.tsx
import { IdeasHeader } from "./components/IdeasHeader";

export default function IdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full flex flex-col text-foreground overflow-hidden">
      <IdeasHeader />
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-background">
        {children}
      </div>
    </div>
  );
}
