// components/auth/ProtectedPage.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, openLoginModal } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            openLoginModal();
        }
    }, [isAuthenticated, isLoading, openLoginModal]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">Verifying access...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
