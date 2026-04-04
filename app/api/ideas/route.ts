import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import type { FilterQuery } from "mongoose";
import type { IIdea } from "@/models/Idea";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const q = searchParams.get("q");
    const sort = searchParams.get("sort") || "confidence";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const skip = (page - 1) * limit;

    await connectDB();

    const query: FilterQuery<IIdea> = {};

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
    } else if (q) {
      // If there's a search text, we might want to sort by text score, but confidence is default usually.
      // If sort is explicitly meant to be text score:
      // sortObj = { score: { $meta: "textScore" } } as any;
    }

    const [ideas, totalCount] = await Promise.all([
      Idea.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select("-evidence -marketData -techReview") // Omit heavy fields for the list view
        .lean(),
      Idea.countDocuments(query),
    ]);

    // Fast domain counts
    const domainCounts = await Idea.aggregate([
      { $group: { _id: "$domain", count: { $sum: 1 } } }
    ]);

    const mappedDomains = domainCounts.map((d) => ({
      name: d._id,
      count: d.count
    }));

    return NextResponse.json({
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

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ideas", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
