// components/auth/hooks/usePermissions.ts
"use client";

import { useAuth } from "../AuthContext";
import { UserRole, hasMinimumRole, canManageResource, isModeratorOrAdmin, isAdmin } from "@/lib/rbac";

export function usePermissions() {
    const { user, isAuthenticated } = useAuth();
    const role = user?.role as UserRole | undefined;

    return {
        role: role || "user",
        isAuthenticated,
        isAdmin: isAdmin(role),
        isModerator: isModeratorOrAdmin(role),
        isContributor: hasMinimumRole(role, "contributor"),
        canCreate: isAuthenticated,
        canEdit: (authorId?: string) => canManageResource(user?._id, role, authorId),
        hasRole: (required: UserRole) => hasMinimumRole(role, required),
    };
}
