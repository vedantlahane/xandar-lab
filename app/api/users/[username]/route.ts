import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Note from "@/models/Note";
import Experiment from "@/models/Experiment";
import Idea from "@/models/Idea";
import Document from "@/models/Document";
import { getSession } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username: rawUsername } = await params;
        await connectDB();
        const session = await getSession();
        const username = rawUsername.toLowerCase();

        // 1. Fetch User
        // Use regex for case-insensitive exact match
        const user = await User.findOne({ 
            username: { $regex: new RegExp(`^${username}$`, "i") } 
        }).select(
            "username bio avatarGradient githubUrl websiteUrl twitterHandle role isProfilePublic followers following reputationScore createdAt"
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const isSelf = session?.userId === user._id.toString();
        const isAdmin = session?.role === "admin";
        
        // 2. Check Privacy
        if (!user.isProfilePublic && !isSelf && !isAdmin) {
            // Return limited profile
            return NextResponse.json({
                user: {
                    id: user._id,
                    username: user.username,
                    avatarGradient: user.avatarGradient,
                    role: user.role,
                    isProfilePublic: false,
                    createdAt: user.createdAt,
                }
            });
        }

        // 3. Fetch public contributions
        const [notes, experiments, ideas, docs] = await Promise.all([
            Note.find({ 
                authorId: user._id, 
                visibility: "public",
                status: "published"
            })
            .select("title category tags upvotes slug isCurated isPinned createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
            
            Experiment.find({ 
                authorId: user._id,
                visibility: "public",
                status: "published"
            })
            .select("title status tags upvotes slug isCurated createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
            
            Idea.find({ 
                authorId: user._id,
                visibility: "public",
                status: { $in: ["open", "in_progress", "completed"] }
            })
            .select("title phase upvotes slug isCurated createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),

            Document.find({
                authorId: user._id,
                visibility: "public",
            })
            .select("title category tags createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
        ]);

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                username: user.username,
                bio: user.bio,
                avatarGradient: user.avatarGradient,
                githubUrl: user.githubUrl,
                websiteUrl: user.websiteUrl,
                twitterHandle: user.twitterHandle,
                role: user.role,
                isProfilePublic: user.isProfilePublic,
                followers: user.followers.map((id: any) => id.toString()),
                following: user.following.map((id: any) => id.toString()),
                reputationScore: user.reputationScore,
                createdAt: user.createdAt,
            },
            contributions: {
                notes: notes.map((n: any) => ({ ...n, _id: n._id.toString() })),
                experiments: experiments.map((e: any) => ({ ...e, _id: e._id.toString() })),
                ideas: ideas.map((i: any) => ({ ...i, _id: i._id.toString() })),
                docs: docs.map((d: any) => ({ ...d, _id: d._id.toString() }))
            },
            isFollowing: session?.userId ? user.followers.some((id: any) => id.toString() === session.userId) : false
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch user profile" },
            { status: 500 }
        );
    }
}
