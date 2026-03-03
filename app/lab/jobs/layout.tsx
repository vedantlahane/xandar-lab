// app/lab/jobs/layout.tsx
import { JobsProvider } from "./context/JobsContext";

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <JobsProvider>
            <div className="relative h-screen flex flex-col text-foreground overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    {children}
                </div>
            </div>
        </JobsProvider>
    );
}
