import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import mongoose from "mongoose";
import type { IIdea } from "@/models/Idea";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const q = searchParams.get("q");
    const sort = searchParams.get("sort") || "confidence";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const skip = (page - 1) * limit;

    await connectDB();

    const query: Record<string, any> = { status: "published" };
    const projection: Record<string, any> = { evidence: 0, marketData: 0, techReview: 0 };

    if (domain && domain !== "all") {
      query.domain = domain;
    }

    if (q) {
      query.$text = { $search: q };
    }

    let sortObj: Record<string, 1 | -1> = { confidence: -1 };
    if (sort === "popular") {
      sortObj = { upvotes: -1, confidence: -1 };
    } else if (sort === "newest") {
      sortObj = { createdAt: -1 };
    } else if (q && !searchParams.has("sort")) {
      // If there's a search text without explicit sort, sort by text score
      sortObj = { score: { $meta: "textScore" } } as any;
      projection.score = { $meta: "textScore" };
    }

    const [ideas, totalCount] = await Promise.all([
      Idea.find(query, projection)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Idea.countDocuments(query),
    ]);

    // Fast domain counts
    const domainCounts = await Idea.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$domain", count: { $sum: 1 } } }
    ]);

    const mappedDomains = domainCounts.map((d) => ({
      name: d._id,
      count: d.count
    }));

    const response = NextResponse.json({
      ideas,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      meta: {
        domains: mappedDomains,
      }
    });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ideas", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { getSession } = await import("@/lib/auth");
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized: Sign in to submit ideas" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      problem,
      solution,
      domain = "Developer Tools",
      targetUser = "Developers",
      techStack = [],
      timeline = "2-4 weeks",
      monetization,
      risks,
      confidence = 80,
      complexity = "medium",
    } = body;

    if (!title || !problem || !solution) {
      return NextResponse.json(
        { error: "Title, problem, and solution are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const newIdea = await Idea.create({
      authorId: new mongoose.Types.ObjectId(session.userId),
      authorUsername: session.username || "Creator",
      authorRole: session.role || "user",
      isCurated: session.role === "admin",
      isPinned: false,
      title: title.trim(),
      slug,
      problem: problem.trim(),
      solution: solution.trim(),
      targetUser: targetUser.trim(),
      domain: domain.trim(),
      tags: Array.isArray(techStack) ? techStack : [],
      confidence: Math.min(100, Math.max(10, Number(confidence) || 80)),
      complexity,
      timeline,
      techStack: Array.isArray(techStack) ? techStack : [],
      monetization: monetization?.trim() || undefined,
      risks: risks?.trim() || undefined,
      evidence: [],
      marketData: {},
      techReview: {},
      batchId: `community-${Date.now()}`,
      iteration: 1,
      upvotes: 1,
      bookmarks: 0,
      status: "published",
      signalDate: new Date(),
    });

    return NextResponse.json({ success: true, idea: newIdea }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create idea", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

