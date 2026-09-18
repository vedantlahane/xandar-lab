// app/api/notes/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { getSession } from "@/lib/auth";
import { canManageResource } from "@/lib/rbac";
import type { UserRole } from "@/lib/rbac";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const note = await Note.findById(id).lean();
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const session = await getSession();
        // Check visibility
        if (note.visibility === "private" && (!session || session.userId !== note.authorId.toString())) {
            return NextResponse.json({ error: "Unauthorized access to private note" }, { status: 403 });
        }

        return NextResponse.json({ note });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch note" }, { status: 500 });
    }
}

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

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!canManageResource(session.userId, userRole, note.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to edit this note" }, { status: 403 });
        }

        const body = await request.json();
        const { title, content, category, color, tags, isPinned, visibility } = body;

        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content;
        if (category !== undefined) note.category = category;
        if (color !== undefined) note.color = color;
        if (tags !== undefined) note.tags = Array.isArray(tags) ? tags : [];
        if (isPinned !== undefined) note.isPinned = !!isPinned;
        if (visibility !== undefined) note.visibility = visibility;

        await note.save();

        return NextResponse.json({
            success: true,
            note: {
                id: note._id.toString(),
                title: note.title,
                content: note.content,
                category: note.category,
                color: note.color,
                tags: note.tags,
                isPinned: note.isPinned,
                visibility: note.visibility,
                authorId: note.authorId.toString(),
                authorUsername: note.authorUsername,
                authorRole: note.authorRole,
                isCurated: false,
                createdAt: new Date(note.createdAt).toISOString().split("T")[0],
                updatedAt: new Date(note.updatedAt).toISOString().split("T")[0],
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update note" }, { status: 500 });
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

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!canManageResource(session.userId, userRole, note.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to delete this note" }, { status: 403 });
        }

        await Note.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Note deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete note" }, { status: 500 });
    }
}
