import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const minConfidence = parseInt(
      req.nextUrl.searchParams.get("minConfidence") || "70"
    );

    const ideas = await Idea.aggregate([
      {
        $match: {
          status: "published",
          confidence: { $gte: minConfidence },
        },
      },
      { $sample: { size: 1 } },
    ]);

    if (!ideas || ideas.length === 0) {
      return NextResponse.json(
        { error: "No ideas available" },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const response = NextResponse.json(ideas[0]);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Random idea fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
