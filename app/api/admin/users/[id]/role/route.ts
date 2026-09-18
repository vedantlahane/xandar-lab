// app/api/admin/users/[id]/role/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import type { UserRole } from "@/lib/rbac";

const VALID_ROLES: UserRole[] = ["user", "pro", "contributor", "moderator", "admin"];

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId || session.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { id } = await params;
        const { role } = await request.json();

        if (!VALID_ROLES.includes(role)) {
            return NextResponse.json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` }, { status: 400 });
        }

        await connectDB();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.role = role;
        await user.save();

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update role" }, { status: 500 });
    }
}
