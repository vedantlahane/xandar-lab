// app/api/experiments/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Experiment from "@/models/Experiment";
import { getSession } from "@/lib/auth";
import { EXPERIMENTS as STATIC_EXPERIMENTS } from "@/app/lab/experiments/data/experiments";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get("tab") || "all";
        const type = searchParams.get("type");
        const status = searchParams.get("status");
        const q = searchParams.get("q");

        const session = await getSession();
        const currentUserId = session?.userId;

        await connectDB();

        const conditions: any[] = [];

        if (tab === "my") {
            if (!currentUserId) {
                return NextResponse.json({ experiments: [], total: 0 });
            }
            conditions.push({ authorId: currentUserId });
        } else if (tab === "community") {
            conditions.push({ visibility: "public" });
        } else {
            if (currentUserId) {
                conditions.push({
                    $or: [
                        { visibility: "public" },
                        { authorId: currentUserId },
                    ],
                });
            } else {
                conditions.push({ visibility: "public" });
            }
        }

        if (type && type !== "All") {
            conditions.push({ type });
        }

        if (status && status !== "All") {
            conditions.push({ status });
        }

        if (q) {
            conditions.push({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { description: { $regex: q, $options: "i" } },
                    { techStack: { $in: [new RegExp(q, "i")] } },
                ],
            });
        }

        const query = conditions.length > 0 ? { $and: conditions } : {};

        const dbExperiments = await Experiment.find(query).sort({ createdAt: -1 }).lean();

        const formattedDb = dbExperiments.map((e: any) => ({
            id: e._id.toString(),
            title: e.title,
            description: e.description,
            status: e.status,
            type: e.type,
            technologies: e.techStack || [],
            startDate: e.startDate || (e.createdAt ? new Date(e.createdAt).toISOString().split("T")[0] : "Recently"),
            endDate: e.completedDate,
            githubUrl: e.githubUrl,
            demoUrl: e.liveUrl,
            notes: e.description,
            learnings: e.highlights || [],
            authorId: e.authorId?.toString(),
            authorUsername: e.authorUsername || "Builder",
            authorRole: e.authorRole || "user",
            visibility: e.visibility || "public",
            upvotes: e.upvotes || 0,
            isPinned: !!e.isPinned,
            isCurated: !!e.isCurated,
            changeRequests: e.changeRequests || [],
        }));

        const staticList = STATIC_EXPERIMENTS.flatMap((c) => c.experiments).map((e) => ({
            ...e,
            isCurated: true,
            authorUsername: "Xandar Lab",
            authorRole: "admin",
        }));

        const filteredSeeds = staticList.filter((e) => {
            if (tab === "my") return false;
            if (type && type !== "All" && e.type !== type) return false;
            if (status && status !== "All" && e.status !== status) return false;
            if (q) {
                const searchLow = q.toLowerCase();
                if (
                    !e.title.toLowerCase().includes(searchLow) &&
                    !e.description.toLowerCase().includes(searchLow) &&
                    !e.technologies.some((t) => t.toLowerCase().includes(searchLow))
                ) {
                    return false;
                }
            }
            return true;
        });

        const combined = [...formattedDb, ...filteredSeeds];

        return NextResponse.json({ experiments: combined, total: combined.length });
    } catch (error: any) {
        console.error("GET /api/experiments error:", error);
        const staticList = STATIC_EXPERIMENTS.flatMap((c) => c.experiments).map((e) => ({
            ...e,
            isCurated: true,
            authorUsername: "Xandar Lab",
            authorRole: "admin",
        }));
        return NextResponse.json({ experiments: staticList, total: staticList.length });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized: Please sign in to submit experiments" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, status, type, tags, githubUrl, liveUrl, techStack, highlights, visibility } = body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        await connectDB();

        const experiment = await Experiment.create({
            authorId: session.userId,
            authorUsername: session.username || "Builder",
            authorRole: session.role || "user",
            title: title.trim(),
            description: description || "",
            status: status || "Active",
            type: type || "Full Stack",
            tags: Array.isArray(tags) ? tags : [],
            githubUrl: githubUrl?.trim() || undefined,
            liveUrl: liveUrl?.trim() || undefined,
            techStack: Array.isArray(techStack) ? techStack : [],
            highlights: Array.isArray(highlights) ? highlights : [],
            visibility: visibility === "private" ? "private" : "public",
        });

        return NextResponse.json({
            success: true,
            experiment: {
                id: experiment._id.toString(),
                title: experiment.title,
                description: experiment.description,
                status: experiment.status,
                type: experiment.type,
                technologies: experiment.techStack,
                startDate: new Date(experiment.createdAt).toISOString().split("T")[0],
                githubUrl: experiment.githubUrl,
                demoUrl: experiment.liveUrl,
                learnings: experiment.highlights,
                authorId: experiment.authorId.toString(),
                authorUsername: experiment.authorUsername,
                authorRole: experiment.authorRole,
                isCurated: false,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/experiments error:", error);
        return NextResponse.json({ error: error.message || "Failed to create experiment" }, { status: 500 });
    }
}
