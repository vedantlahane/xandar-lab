"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthContext";
import type { User } from "@/components/auth/types";

export type Role = NonNullable<User['role']>;

interface RoleGuardProps {
    allowedRoles: Role[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null; // Or a loading spinner if preferred, but usually silent is better for guards
    }

    if (!isAuthenticated || !user) {
        return <>{fallback}</>;
    }

    const userRole = user.role || 'user'; // Default to 'user' if undefined

    if (allowedRoles.includes(userRole as Role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
