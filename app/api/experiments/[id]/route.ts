import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Experiment from "@/models/Experiment";
import { getSession } from "@/lib/auth";
import { canManageResource, canDeleteResource } from "@/lib/rbac";
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
        const userRole = session.role as UserRole | undefined;

        await connectDB();

        if (!mongoose.isValidObjectId(id)) {
            if (userRole === "admin" || userRole === "moderator") {
                const body = await request.json();
                const createdExp = await Experiment.create({
                    authorId: session.userId,
                    authorUsername: session.username || "Admin",
                    authorRole: session.role || "admin",
                    title: body.title?.trim() || "Untitled Experiment",
                    description: body.description || "",
                    status: body.status || "Active",
                    type: body.type || "Full Stack",
                    tags: Array.isArray(body.tags) ? body.tags : [],
                    githubUrl: body.githubUrl?.trim() || undefined,
                    liveUrl: body.liveUrl?.trim() || undefined,
                    techStack: Array.isArray(body.techStack) ? body.techStack : [],
                    highlights: Array.isArray(body.highlights) ? body.highlights : [],
                    visibility: body.visibility === "private" ? "private" : "public",
                });
                return NextResponse.json({
                    success: true,
                    experiment: {
                        id: createdExp._id.toString(),
                        title: createdExp.title,
                        description: createdExp.description,
                        status: createdExp.status,
                        type: createdExp.type,
                        technologies: createdExp.techStack,
                        githubUrl: createdExp.githubUrl,
                        demoUrl: createdExp.liveUrl,
                        learnings: createdExp.highlights,
                        authorId: createdExp.authorId.toString(),
                        authorUsername: createdExp.authorUsername,
                        authorRole: createdExp.authorRole,
                        isCurated: false,
                    },
                });
            }
            return NextResponse.json({ error: "Invalid experiment ID" }, { status: 400 });
        }

        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
        }

        const canEdit =
            canManageResource(session.userId, userRole, experiment.authorId.toString()) ||
            experiment.sharedWith?.some((s: any) => s.userId.toString() === session.userId && s.permission === "editor");

        if (!canEdit) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to edit this experiment" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, status, type, githubUrl, liveUrl, techStack, highlights, visibility, isCurated, isPinned, parameters, metrics, sharedWith } = body;

        if (title !== undefined) experiment.title = title.trim();
        if (description !== undefined) experiment.description = description;
        if (status !== undefined) experiment.status = status;
        if (type !== undefined) experiment.type = type;
        if (githubUrl !== undefined) experiment.githubUrl = githubUrl?.trim() || undefined;
        if (liveUrl !== undefined) experiment.liveUrl = liveUrl?.trim() || undefined;
        if (techStack !== undefined) experiment.techStack = Array.isArray(techStack) ? techStack : [];
        if (highlights !== undefined) experiment.highlights = Array.isArray(highlights) ? highlights : [];
        if (visibility !== undefined) experiment.visibility = visibility === "public" ? "public" : visibility === "shared" ? "shared" : "private";
        if (parameters !== undefined) experiment.parameters = parameters;
        if (metrics !== undefined) experiment.metrics = metrics;
        if (sharedWith !== undefined) experiment.sharedWith = Array.isArray(sharedWith) ? sharedWith : [];
        if (isPinned !== undefined) experiment.isPinned = !!isPinned;
        if (isCurated !== undefined && userRole === "admin") {
            experiment.isCurated = !!isCurated;
        }

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
                parameters: experiment.parameters,
                metrics: experiment.metrics,
                sharedWith: experiment.sharedWith?.map((s: any) => ({
                    userId: s.userId?.toString(),
                    permission: s.permission,
                })) || [],
                githubUrl: experiment.githubUrl,
                demoUrl: experiment.liveUrl,
                learnings: experiment.highlights,
                authorId: experiment.authorId.toString(),
                authorUsername: experiment.authorUsername,
                authorRole: experiment.authorRole,
                isPinned: !!experiment.isPinned,
                isCurated: !!experiment.isCurated,
                visibility: experiment.visibility,
                changeRequests: experiment.changeRequests || [],
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
        const userRole = session.role as UserRole | undefined;

        if (!mongoose.isValidObjectId(id)) {
            if (userRole === "admin" || userRole === "moderator") {
                return NextResponse.json({ success: true, message: "Curated experiment dismissed" });
            }
            return NextResponse.json({ error: "Invalid experiment ID" }, { status: 400 });
        }

        await connectDB();

        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
        }

        if (!canDeleteResource(session.userId, userRole, experiment.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to delete this experiment" }, { status: 403 });
        }

        await Experiment.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Experiment deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete experiment" }, { status: 500 });
    }
}
