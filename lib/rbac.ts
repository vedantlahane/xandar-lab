// lib/rbac.ts

export type UserRole = 'user' | 'pro' | 'contributor' | 'moderator' | 'admin';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    user: 1,
    pro: 2,
    contributor: 3,
    moderator: 4,
    admin: 5,
};

/**
 * Checks if a user has at least the required role level.
 */
export function hasMinimumRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
    if (!userRole) return false;
    return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

/**
 * Determines whether a user can edit or delete a specific resource.
 * Owners can always edit their own content. Moderators and Admins can edit or delete any content.
 */
export function canManageResource(
    currentUserId: string | undefined,
    currentUserRole: UserRole | undefined,
    resourceAuthorId: string | undefined
): boolean {
    if (!currentUserId) return false;
    if (currentUserRole === 'admin' || currentUserRole === 'moderator') return true;
    if (resourceAuthorId && currentUserId === resourceAuthorId.toString()) return true;
    return false;
}

/**
 * Checks if a user can publish directly to the public community feed without approval.
 */
export function canPublishDirectly(role: UserRole | undefined): boolean {
    if (!role) return false;
    return hasMinimumRole(role, 'user');
}

/**
 * Checks if a user has moderation privileges (hide, edit community tags, pin, remove spam).
 */
export function isModeratorOrAdmin(role: UserRole | undefined): boolean {
    if (!role) return false;
    return hasMinimumRole(role, 'moderator');
}

/**
 * Checks if a user has full admin privileges.
 */
export function isAdmin(role: UserRole | undefined): boolean {
    return role === 'admin';
}
