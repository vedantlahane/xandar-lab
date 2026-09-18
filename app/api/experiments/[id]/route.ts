// app/api/experiments/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Experiment from "@/models/Experiment";
import { getSession } from "@/lib/auth";
import { canManageResource } from "@/lib/rbac";
import type { UserRole } from "@/lib/rbac";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!canManageResource(session.userId, userRole, experiment.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to edit this experiment" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, status, type, githubUrl, liveUrl, techStack, highlights, visibility } = body;

        if (title !== undefined) experiment.title = title.trim();
        if (description !== undefined) experiment.description = description;
        if (status !== undefined) experiment.status = status;
        if (type !== undefined) experiment.type = type;
        if (githubUrl !== undefined) experiment.githubUrl = githubUrl?.trim() || undefined;
        if (liveUrl !== undefined) experiment.liveUrl = liveUrl?.trim() || undefined;
        if (techStack !== undefined) experiment.techStack = Array.isArray(techStack) ? techStack : [];
        if (highlights !== undefined) experiment.highlights = Array.isArray(highlights) ? highlights : [];
        if (visibility !== undefined) experiment.visibility = visibility;

        await experiment.save();

        return NextResponse.json({
            success: true,
            experiment: {
                id: experiment._id.toString(),
                title: experiment.title,
                description: experiment.description,
                status: experiment.status,
                type: experiment.type,
                technologies: experiment.techStack,
                githubUrl: experiment.githubUrl,
                demoUrl: experiment.liveUrl,
                learnings: experiment.highlights,
                authorId: experiment.authorId.toString(),
                authorUsername: experiment.authorUsername,
                authorRole: experiment.authorRole,
                isCurated: false,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update experiment" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!canManageResource(session.userId, userRole, experiment.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to delete this experiment" }, { status: 403 });
        }

        await Experiment.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Experiment deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete experiment" }, { status: 500 });
    }
}
