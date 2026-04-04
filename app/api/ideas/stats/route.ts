import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import PipelineRun from "@/models/PipelineRun";

export async function GET() {
  try {
    await connectDB();

    const [result] = await Idea.aggregate([
      { $match: { status: "published" } },
      {
        $facet: {
          total: [
            { $count: "count" }
          ],
          avgConfidence: [
            {
              $group: {
                _id: null,
                avg: { $avg: "$confidence" },
              },
            },
          ],
          byDomain: [
            {
              $group: {
                _id: "$domain",
                count: { $sum: 1 },
                avgConfidence: { $avg: "$confidence" },
              },
            },
            { $sort: { count: -1 } },
          ],
          byComplexity: [
            {
              $group: {
                _id: "$complexity",
                count: { $sum: 1 },
              },
            },
          ],
          lastRefreshed: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { createdAt: 1 } },
          ],
        },
      },
    ]);

    const stats = {
      totalIdeas: result?.total[0]?.count || 0,
      avgConfidence: Math.round(result?.avgConfidence[0]?.avg || 0),
      totalDomains: result?.byDomain.length || 0,
      lastRefreshed: result?.lastRefreshed[0]?.createdAt || null,
      domains: result?.byDomain.map((d: any) => ({
        domain: d._id,
        count: d.count,
        avgConfidence: Math.round(d.avgConfidence),
      })),
      complexity: result?.byComplexity.map((c: any) => ({
        level: c._id,
        count: c.count,
      })),
    };

    const response = NextResponse.json(stats);
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
