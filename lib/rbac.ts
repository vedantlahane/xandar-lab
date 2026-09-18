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
 * Determines whether a user can edit a specific resource.
 * Author, Moderator, and Admin can edit.
 */
export function canEditResource(
    currentUserId: string | undefined,
    currentUserRole: UserRole | undefined,
    resourceAuthorId: string | undefined
): boolean {
    if (!currentUserId) return false;
    if (hasMinimumRole(currentUserRole, 'moderator')) return true;
    if (resourceAuthorId && currentUserId === resourceAuthorId.toString()) return true;
    return false;
}

/**
 * Backward-compatible alias for canEditResource.
 */
export function canManageResource(
    currentUserId: string | undefined,
    currentUserRole: UserRole | undefined,
    resourceAuthorId: string | undefined
): boolean {
    return canEditResource(currentUserId, currentUserRole, resourceAuthorId);
}

/**
 * Determines whether a user can delete a specific resource.
 * Authors can delete their own; Admins can delete any resource.
 */
export function canDeleteResource(
    currentUserId: string | undefined,
    currentUserRole: UserRole | undefined,
    resourceAuthorId: string | undefined
): boolean {
    if (!currentUserId) return false;
    if (currentUserRole === 'admin') return true;
    if (resourceAuthorId && currentUserId === resourceAuthorId.toString()) return true;
    return false;
}

/**
 * Checks if a user can publish directly to the public community feed.
 * Contributor, Moderator, and Admin can publish directly.
 */
export function canPublishDirectly(role: UserRole | undefined): boolean {
    return hasMinimumRole(role, 'contributor');
}

/**
 * Checks if a user can request revisions/changes from an author.
 * Moderator and Admin can request changes.
 */
export function canRequestChanges(role: UserRole | undefined): boolean {
    return hasMinimumRole(role, 'moderator');
}

/**
 * Checks if a user can pin or unpin content in community lists.
 * Moderator and Admin can pin.
 */
export function canPinContent(role: UserRole | undefined): boolean {
    return hasMinimumRole(role, 'moderator');
}

/**
 * Checks if a user can officially curate content ("Curated by Xandar").
 * Only Admin can curate.
 */
export function canCurateContent(role: UserRole | undefined): boolean {
    return role === 'admin';
}

/**
 * Checks if a user has moderation privileges (hide, edit community tags, pin, review).
 */
export function isModeratorOrAdmin(role: UserRole | undefined): boolean {
    return hasMinimumRole(role, 'moderator');
}

/**
 * Checks if a user has full admin privileges.
 */
export function isAdmin(role: UserRole | undefined): boolean {
    return role === 'admin';
}

