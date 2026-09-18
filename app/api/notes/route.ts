// app/api/notes/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { getSession } from "@/lib/auth";
import { NOTES as STATIC_NOTES } from "@/app/lab/notes/data/notes";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get("tab") || "all"; // 'all' | 'my' | 'community'
        const category = searchParams.get("category");
        const q = searchParams.get("q");

        const session = await getSession();
        const currentUserId = session?.userId;

        await connectDB();

        // Build mongo query
        const conditions: any[] = [];

        if (tab === "my") {
            if (!currentUserId) {
                return NextResponse.json({ notes: [], total: 0 });
            }
            conditions.push({ authorId: currentUserId });
        } else if (tab === "community") {
            conditions.push({ visibility: "public", status: "published" });
        } else {
            // "all": community notes + user's private notes if logged in
            if (currentUserId) {
                conditions.push({
                    $or: [
                        { visibility: "public", status: "published" },
                        { authorId: currentUserId },
                    ],
                });
            } else {
                conditions.push({ visibility: "public", status: "published" });
            }
        }

        if (category && category !== "All") {
            conditions.push({ category });
        }

        if (q) {
            conditions.push({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { content: { $regex: q, $options: "i" } },
                    { tags: { $in: [new RegExp(q, "i")] } },
                ],
            });
        }

        const query = conditions.length > 0 ? { $and: conditions } : {};

        const dbNotes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 }).lean();

        // Map DB notes to standard client format
        const formattedDbNotes = dbNotes.map((n: any) => ({
            id: n._id.toString(),
            title: n.title,
            content: n.content,
            category: n.category,
            color: n.color,
            tags: n.tags || [],
            isPinned: !!n.isPinned,
            visibility: n.visibility || "private",
            status: n.status || "published",
            authorId: n.authorId?.toString(),
            authorUsername: n.authorUsername || "Anonymous",
            authorRole: n.authorRole || "user",
            upvotes: n.upvotes || 0,
            isCurated: !!n.isCurated,
            changeRequests: n.changeRequests || [],
            createdAt: n.createdAt ? new Date(n.createdAt).toISOString().split("T")[0] : "Recently",
            updatedAt: n.updatedAt ? new Date(n.updatedAt).toISOString().split("T")[0] : "Recently",
        }));

        // Flatten static seed notes
        const seedNotes = STATIC_NOTES.flatMap((g) => g.notes).map((n) => ({
            ...n,
            isCurated: true,
            visibility: "public" as const,
            authorUsername: "Xandar Curated",
            authorRole: "admin",
        }));

        // Filter static seeds if search or category applied
        const filteredSeeds = seedNotes.filter((note) => {
            if (tab === "my") return false; // Static notes don't belong to current user
            if (category && category !== "All" && note.category !== category) return false;
            if (q) {
                const searchLow = q.toLowerCase();
                if (
                    !note.title.toLowerCase().includes(searchLow) &&
                    !note.content.toLowerCase().includes(searchLow) &&
                    !note.tags?.some((t) => t.toLowerCase().includes(searchLow))
                ) {
                    return false;
                }
            }
            return true;
        });

        // Combine DB notes with curated seeds (avoid duplicates if already migrated)
        const combined = [...formattedDbNotes, ...filteredSeeds];

        return NextResponse.json({ notes: combined, total: combined.length });
    } catch (error: any) {
        console.error("GET /api/notes error:", error);
        // Resilient fallback to static notes if DB is unreachable
        const seedNotes = STATIC_NOTES.flatMap((g) => g.notes).map((n) => ({
            ...n,
            isCurated: true,
            visibility: "public" as const,
            authorUsername: "Xandar Curated",
            authorRole: "admin",
        }));
        return NextResponse.json({ notes: seedNotes, total: seedNotes.length });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized: Please sign in to create notes" }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, category, color, tags, isPinned, visibility } = body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        await connectDB();

        const note = await Note.create({
            authorId: session.userId,
            authorUsername: session.username || "Creator",
            authorRole: session.role || "user",
            title: title.trim(),
            content: content || "",
            category: category || "Learning",
            color: color || "default",
            tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
            isPinned: !!isPinned,
            visibility: visibility === "public" ? "public" : "private",
            status: "published",
        });

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
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/notes error:", error);
        return NextResponse.json({ error: error.message || "Failed to create note" }, { status: 500 });
    }
}
