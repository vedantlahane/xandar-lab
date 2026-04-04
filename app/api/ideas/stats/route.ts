import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import PipelineRun from "@/models/PipelineRun";

export async function GET() {
  try {
    await connectDB();

    const [totalIdeas, distinctDomains, avgResult, lastRun] = await Promise.all([
      Idea.countDocuments(),
      Idea.distinct("domain"),
      Idea.aggregate([
        { $group: { _id: null, avgConfidence: { $avg: "$confidence" } } }
      ]),
      PipelineRun.findOne({ status: "completed" }).sort({ createdAt: -1 }).select("createdAt").lean()
    ]);

    const avgConfidence = avgResult.length > 0 ? Math.round(avgResult[0].avgConfidence) : 0;
    
    return NextResponse.json({
      totalIdeas,
      totalDomains: distinctDomains.length,
      avgConfidence,
      lastRefreshed: lastRun?.createdAt || null
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
