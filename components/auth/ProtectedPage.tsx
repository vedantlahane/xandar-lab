"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, openLoginModal } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            openLoginModal();
        }
    }, [isAuthenticated, openLoginModal]);

    if (!isAuthenticated) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Please login to access this content.
            </div>
        );
    }

    return <>{children}</>;
}
