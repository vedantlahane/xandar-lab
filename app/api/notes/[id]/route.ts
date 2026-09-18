import { NextResponse } from "next/server";
import mongoose from "mongoose";
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
        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
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
        const userRole = session.role as UserRole | undefined;

        await connectDB();

        if (!mongoose.isValidObjectId(id)) {
            if (userRole === "admin" || userRole === "moderator") {
                const body = await request.json();
                const createdNote = await Note.create({
                    title: body.title?.trim() || "Untitled Note",
                    content: body.content || "",
                    category: body.category || "Learning",
                    color: body.color || "default",
                    tags: Array.isArray(body.tags) ? body.tags : [],
                    isPinned: !!body.isPinned,
                    visibility: body.visibility || "public",
                    authorId: session.userId,
                    authorUsername: session.username || "Admin",
                    authorRole: session.role || "admin",
                });
                return NextResponse.json({
                    success: true,
                    note: {
                        id: createdNote._id.toString(),
                        title: createdNote.title,
                        content: createdNote.content,
                        category: createdNote.category,
                        color: createdNote.color,
                        tags: createdNote.tags,
                        isPinned: createdNote.isPinned,
                        visibility: createdNote.visibility,
                        authorId: createdNote.authorId.toString(),
                        authorUsername: createdNote.authorUsername,
                        authorRole: createdNote.authorRole,
                        isCurated: false,
                        createdAt: new Date(createdNote.createdAt).toISOString().split("T")[0],
                        updatedAt: new Date(createdNote.updatedAt).toISOString().split("T")[0],
                    },
                });
            }
            return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
        }

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

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
        const userRole = session.role as UserRole | undefined;

        if (!mongoose.isValidObjectId(id)) {
            if (userRole === "admin" || userRole === "moderator") {
                return NextResponse.json({ success: true, message: "Curated note dismissed" });
            }
            return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
        }

        await connectDB();

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        if (!canManageResource(session.userId, userRole, note.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to delete this note" }, { status: 403 });
        }

        await Note.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Note deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete note" }, { status: 500 });
    }
}
