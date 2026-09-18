import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const targetUsername = username.toLowerCase();

        // Find both users
        const [targetUser, currentUser] = await Promise.all([
            User.findOne({ username: { $regex: new RegExp(`^${targetUsername}$`, "i") } }),
            User.findById(session.userId)
        ]);

        if (!targetUser || !currentUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (targetUser._id.toString() === currentUser._id.toString()) {
            return NextResponse.json(
                { error: "You cannot follow yourself" },
                { status: 400 }
            );
        }

        const isFollowing = targetUser.followers.includes(currentUser._id);

        if (isFollowing) {
            // Unfollow
            await Promise.all([
                User.findByIdAndUpdate(targetUser._id, {
                    $pull: { followers: currentUser._id }
                }),
                User.findByIdAndUpdate(currentUser._id, {
                    $pull: { following: targetUser._id }
                })
            ]);
            return NextResponse.json({ followed: false });
        } else {
            // Follow
            await Promise.all([
                User.findByIdAndUpdate(targetUser._id, {
                    $addToSet: { followers: currentUser._id }
                }),
                User.findByIdAndUpdate(currentUser._id, {
                    $addToSet: { following: targetUser._id }
                })
            ]);
            return NextResponse.json({ followed: true });
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
        return NextResponse.json(
            { error: "Failed to toggle follow status" },
            { status: 500 }
        );
    }
}
