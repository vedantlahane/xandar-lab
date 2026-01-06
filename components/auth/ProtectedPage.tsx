"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, openLoginModal } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // The middleware handles the redirect, but we also open the modal as fallback
            openLoginModal();
        }
    }, [isAuthenticated, isLoading, openLoginModal]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Verifying access...</p>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                        Authentication Required
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Please sign in to access this page.
                    </p>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
