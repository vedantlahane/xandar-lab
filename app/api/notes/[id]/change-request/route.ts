// app/api/notes/[id]/change-request/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { getSession } from "@/lib/auth";
import { isModeratorOrAdmin } from "@/lib/rbac";
import type { UserRole } from "@/lib/rbac";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!isModeratorOrAdmin(userRole)) {
            return NextResponse.json({ error: "Only admins and moderators can request changes from authors" }, { status: 403 });
        }

        const { id } = await params;
        const { message } = await request.json();

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "A message describing the requested changes is required" }, { status: 400 });
        }

        await connectDB();

        // If it's not an ObjectId, handle curated seed note by persisting it first
        let note: any;
        if (!mongoose.isValidObjectId(id)) {
            note = await Note.create({
                title: `Curated Note #${id}`,
                content: "Curated content",
                category: "Learning",
                visibility: "public",
                isCurated: true,
                authorId: session.userId,
                authorUsername: "Xandar Curated",
                authorRole: "admin",
            });
        } else {
            note = await Note.findById(id);
        }

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const newRequest = {
            requestedBy: session.username || "Admin",
            requestedById: new mongoose.Types.ObjectId(session.userId),
            requestedByRole: session.role || "admin",
            message: message.trim(),
            status: "pending" as const,
            createdAt: new Date(),
        };

        if (!note.changeRequests) {
            note.changeRequests = [];
        }

        note.changeRequests.push(newRequest);
        await note.save();

        return NextResponse.json({
            success: true,
            changeRequests: note.changeRequests,
            noteId: note._id.toString(),
        });
    } catch (error: any) {
        console.error("POST /api/notes/[id]/change-request error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit change request" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
        }

        const { requestId } = await request.json();
        await connectDB();

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        const isAuthor = note.authorId && note.authorId.toString() === session.userId;
        const isModOrAdmin = isModeratorOrAdmin(userRole);

        if (!isAuthor && !isModOrAdmin) {
            return NextResponse.json({ error: "Forbidden: You cannot resolve this request" }, { status: 403 });
        }

        if (!note.changeRequests || note.changeRequests.length === 0) {
            return NextResponse.json({ error: "No change requests found" }, { status: 404 });
        }

        let targetRequest: any;
        if (requestId) {
            targetRequest = note.changeRequests.id ? note.changeRequests.id(requestId) : note.changeRequests.find((r: any) => r._id?.toString() === requestId);
        } else {
            // Resolve most recent pending request
            targetRequest = note.changeRequests.slice().reverse().find((r: any) => r.status === "pending");
        }

        if (!targetRequest) {
            return NextResponse.json({ error: "Change request not found" }, { status: 404 });
        }

        targetRequest.status = "resolved";
        targetRequest.resolvedAt = new Date();
        await note.save();

        return NextResponse.json({
            success: true,
            changeRequests: note.changeRequests,
        });
    } catch (error: any) {
        console.error("PATCH /api/notes/[id]/change-request error:", error);
        return NextResponse.json({ error: error.message || "Failed to resolve change request" }, { status: 500 });
    }
}
