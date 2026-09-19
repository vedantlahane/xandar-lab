import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/models/Document";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        await connectDB();
        const session = await getSession();
        const currentUserId = session?.userId;
        const { searchParams } = new URL(request.url);
        
        const tab = searchParams.get("tab") || "my";
        const q = searchParams.get("q") || "";
        const parentId = searchParams.get("parentId") || null;

        let conditions: any = {};

        if (tab === "trash") {
            if (!currentUserId) {
                return NextResponse.json({ documents: [], total: 0 });
            }
            conditions = { authorId: currentUserId, isDeleted: true };
        } else if (tab === "my") {
            if (!currentUserId) {
                return NextResponse.json({ documents: [], total: 0 });
            }
            conditions = { authorId: currentUserId, isDeleted: { $ne: true } };
        } else if (tab === "community") {
            conditions = { visibility: "public", status: "published", isDeleted: { $ne: true } };
        } else {
            // all
            if (currentUserId) {
                conditions = {
                    $or: [
                        { visibility: "public", status: "published" },
                        { authorId: currentUserId },
                        { "sharedWith.userId": currentUserId }
                    ],
                    isDeleted: { $ne: true }
                };
            } else {
                conditions = { visibility: "public", status: "published", isDeleted: { $ne: true } };
            }
        }

        if (parentId && parentId !== 'null') {
            conditions.parentId = parentId;
        }

        if (q) {
            conditions.$or = [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
            ];
        }

        const docs = await Document.find(conditions).sort({ createdAt: -1 }).lean();

        const formattedDocs = docs.map((doc: any) => ({
            id: doc._id.toString(),
            title: doc.title,
            content: doc.content,
            parentId: doc.parentId?.toString(),
            visibility: doc.visibility,
            sharedWith: doc.sharedWith?.map((s: any) => ({
                userId: s.userId?.toString(),
                permission: s.permission,
            })) || [],
            status: doc.status,
            authorId: doc.authorId.toString(),
            authorUsername: doc.authorUsername,
            authorRole: doc.authorRole,
            isCurated: !!doc.isCurated,
            icon: doc.icon,
            coverImage: doc.coverImage,
            isDeleted: !!doc.isDeleted,
            createdAt: new Date(doc.createdAt).toISOString().split("T")[0],
            updatedAt: new Date(doc.updatedAt).toISOString().split("T")[0],
        }));

        return NextResponse.json({ documents: formattedDocs, total: formattedDocs.length });
    } catch (error: any) {
        console.error("GET /api/docs error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, parentId, visibility, sharedWith, icon, coverImage } = body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        await connectDB();

        const doc = await Document.create({
            authorId: session.userId,
            authorUsername: session.username || "Creator",
            authorRole: session.role || "user",
            title: title.trim(),
            content: content || "",
            parentId: parentId || null,
            visibility: visibility === "public" ? "public" : visibility === "shared" ? "shared" : "private",
            sharedWith: Array.isArray(sharedWith) ? sharedWith : [],
            status: "published",
            icon: icon,
            coverImage: coverImage,
            isDeleted: false,
        });

        return NextResponse.json({
            success: true,
            document: {
                id: doc._id.toString(),
                title: doc.title,
                content: doc.content,
                parentId: doc.parentId?.toString(),
                visibility: doc.visibility,
                authorId: doc.authorId.toString(),
                authorUsername: doc.authorUsername,
                authorRole: doc.authorRole,
                isCurated: false,
                createdAt: new Date(doc.createdAt).toISOString().split("T")[0],
                updatedAt: new Date(doc.updatedAt).toISOString().split("T")[0],
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/docs error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
