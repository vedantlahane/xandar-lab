// app/api/notes/[id]/pin/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { getSession } from "@/lib/auth";
import { canManageResource } from "@/lib/rbac";
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

        const { id } = await params;
        await connectDB();

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!canManageResource(session.userId, userRole, note.authorId.toString())) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        return NextResponse.json({ success: true, isPinned: note.isPinned });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to toggle pin" }, { status: 500 });
    }
}
