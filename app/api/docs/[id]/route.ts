import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/models/Document";
import { getSession } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const doc = await Document.findById(id);

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const canEdit =
            doc.authorId.toString() === session.userId ||
            session.role === "admin" ||
            doc.sharedWith?.some((s: any) => s.userId.toString() === session.userId && s.permission === "editor");

        if (!canEdit) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { title, content, parentId, visibility, sharedWith, icon, coverImage, isDeleted } = body;

        if (title !== undefined) doc.title = title.trim();
        
        if (content !== undefined && content !== doc.content) {
            // Push old content to revisions
            if (!doc.revisions) doc.revisions = [];
            doc.revisions.push({
                content: doc.content,
                updatedAt: doc.updatedAt || new Date()
            });
            doc.content = content;
        }
        
        if (parentId !== undefined) doc.parentId = parentId === null ? null : parentId;
        if (visibility !== undefined) doc.visibility = visibility;
        if (sharedWith !== undefined) doc.sharedWith = Array.isArray(sharedWith) ? sharedWith : [];
        if (icon !== undefined) doc.icon = icon;
        if (coverImage !== undefined) doc.coverImage = coverImage;
        if (isDeleted !== undefined) doc.isDeleted = !!isDeleted;

        await doc.save();

        return NextResponse.json({
            success: true,
            document: {
                id: doc._id.toString(),
                title: doc.title,
                content: doc.content,
                parentId: doc.parentId?.toString(),
                visibility: doc.visibility,
                sharedWith: doc.sharedWith?.map((s: any) => ({
                    userId: s.userId?.toString(),
                    permission: s.permission,
                })) || [],
                authorId: doc.authorId.toString(),
                authorUsername: doc.authorUsername,
                authorRole: doc.authorRole,
                isCurated: !!doc.isCurated,
                icon: doc.icon,
                coverImage: doc.coverImage,
                isDeleted: !!doc.isDeleted,
                revisions: doc.revisions,
                createdAt: new Date(doc.createdAt).toISOString().split("T")[0],
                updatedAt: new Date(doc.updatedAt).toISOString().split("T")[0],
            },
        });
    } catch (error: any) {
        console.error(`PUT /api/docs error:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const doc = await Document.findById(id);

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        if (doc.authorId.toString() !== session.userId && session.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (doc.isDeleted) {
            await doc.deleteOne(); // hard delete
        } else {
            doc.isDeleted = true;
            await doc.save();
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`DELETE /api/docs error:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
