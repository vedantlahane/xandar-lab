// components/auth/hooks/usePermissions.ts
"use client";

import { useAuth } from "../AuthContext";
import {
    UserRole,
    hasMinimumRole,
    canEditResource,
    canDeleteResource,
    canPublishDirectly,
    canRequestChanges,
    canPinContent,
    canCurateContent,
    isModeratorOrAdmin,
    isAdmin,
} from "@/lib/rbac";

export function usePermissions() {
    const { user, isAuthenticated } = useAuth();
    const role = user?.role as UserRole | undefined;

    return {
        role: role || "user",
        isAuthenticated,
        // Role tiers: user < pro < contributor < moderator < admin
        isUser: true,
        isPro: hasMinimumRole(role, "pro"),
        isContributor: hasMinimumRole(role, "contributor"),
        isModerator: hasMinimumRole(role, "moderator"),
        isAdmin: isAdmin(role),

        // In-situ contextual capabilities
        canCreate: isAuthenticated,
        canPublishPublic: canPublishDirectly(role),
        canRequestChanges: canRequestChanges(role),
        canPin: canPinContent(role),
        canCurate: canCurateContent(role),

        // Resource-specific checks
        canEdit: (authorId?: string): boolean => canEditResource(user?._id, role, authorId),
        canDelete: (authorId?: string): boolean => canDeleteResource(user?._id, role, authorId),
        canChangeVisibility: (authorId?: string): boolean => !!(isModeratorOrAdmin(role) || (user?._id && authorId && user._id === authorId)),
        hasRole: (required: UserRole): boolean => hasMinimumRole(role, required),
    };
}

