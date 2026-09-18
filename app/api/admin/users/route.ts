// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId || session.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        await connectDB();

        const query: any = {};
        if (q) {
            query.$or = [
                { username: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(query, "username email role reputationScore isProfilePublic createdAt")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        return NextResponse.json({
            users: users.map((u: any) => ({
                id: u._id.toString(),
                username: u.username,
                email: u.email,
                role: u.role || "user",
                reputationScore: u.reputationScore || 0,
                createdAt: u.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
    }
}
