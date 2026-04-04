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
