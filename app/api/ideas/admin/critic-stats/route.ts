import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PipelineRun from "@/models/PipelineRun";

export async function GET() {
  try {
    await connectDB();

    const stats = await PipelineRun.aggregate([
      { $match: { status: "completed", "criticStats.totalIdeasCritiqued": { $gt: 0 } } },
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                totalRuns: { $sum: 1 },
                avgKillRate: { $avg: "$criticStats.killRate" },
                avgIterations: { $avg: "$criticStats.iterationsUsed" },
                maxIterationsHitCount: {
                  $sum: { $cond: ["$criticStats.maxIterationsHit", 1, 0] },
                },
                totalKilled: { $sum: "$criticStats.killed" },
                totalProceeded: { $sum: "$criticStats.proceeded" },
              },
            },
          ],
          byDomain: [
            {
              $group: {
                _id: "$domain",
                runs: { $sum: 1 },
                avgKillRate: { $avg: "$criticStats.killRate" },
                avgIterations: { $avg: "$criticStats.iterationsUsed" },
              },
            },
            { $sort: { avgKillRate: -1 } },
          ],
          recentTrend: [
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
            {
              $project: {
                domain: 1,
                killRate: "$criticStats.killRate",
                iterationsUsed: "$criticStats.iterationsUsed",
                maxIterationsHit: "$criticStats.maxIterationsHit",
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0] || {};
    const overall = result.overall && result.overall[0] ? result.overall[0] : null;

    let recommendation = "Not enough data to provide a recommendation.";
    let criticTooHarsh = false;
    let criticTooLenient = false;
    let frequentMaxIterations = false;

    if (overall) {
      const { avgKillRate, maxIterationsHitCount, totalRuns } = overall;
      criticTooHarsh = avgKillRate > 0.8;
      criticTooLenient = avgKillRate < 0.3;
      frequentMaxIterations = totalRuns > 0 && (maxIterationsHitCount / totalRuns > 0.3);

      if (criticTooHarsh) {
        recommendation = "Critic is too harsh. Consider softening the critic prompt to allow more REVISE verdicts instead of KILL.";
      } else if (criticTooLenient) {
        recommendation = "Critic is too lenient. Consider adding stricter evaluation criteria for originality and market differentiation.";
      } else if (frequentMaxIterations) {
        recommendation = "Pipeline frequently exhausts all iterations. This wastes API calls. Either soften the Critic or improve Ideator prompt to generate stronger initial ideas.";
      } else if (avgKillRate >= 0.4 && avgKillRate <= 0.7) {
        recommendation = "Critic calibration looks healthy. Kill rate is in the optimal range.";
      } else {
        recommendation = "Critic is operating outside optimal range but not at extremes. Monitor performance.";
      }
    }

    return NextResponse.json({
      overall: overall || {
        totalRuns: 0,
        avgKillRate: 0,
        avgIterations: 0,
        maxIterationsHitCount: 0,
        totalKilled: 0,
        totalProceeded: 0,
      },
      byDomain: result.byDomain || [],
      recentTrend: result.recentTrend || [],
      interpretation: {
        criticTooHarsh,
        criticTooLenient,
        frequentMaxIterations,
        recommendation,
      },
    });
  } catch (error) {
    console.error("Failed to fetch critic stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch critic stats" },
      { status: 500 }
    );
  }
}
