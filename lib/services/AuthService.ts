import { auth } from "@/auth";
import { NextResponse } from "next/server";


/**
 * AuthService provides methods for handling user authentication and authorization.
 * It includes methods to get the current session, require authentication, and enforce role-based access control.
 */
export class AuthService {
  static async getSession() {
    return await auth();
  }

  static async requireAuth() {
    const session = await this.getSession();
    if (!session?.user) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    return { user: session.user };
  }

  static async requireRole(allowedRoles: string[]) {
    const { user, error } = await this.requireAuth();
    if (error) return { error };
    
    if (!allowedRoles.includes(user.role as string)) {
      return { error: NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 }) };
    }
    return { user };
  }

  static async requireAdmin() {
    return this.requireRole(["admin"]);
  }

  static async requireProOrAdmin() {
    return this.requireRole(["pro", "admin", "moderator"]);
  }
}
