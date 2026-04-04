import { NextResponse } from "next/server";
import { runScheduledGeneration } from "@/lib/ideas/scheduler";
import connectDB from "@/lib/db";
import PipelineRun from "@/models/PipelineRun";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const expectedSecret = process.env.CRON_SECRET || "dev-secret-123"; // Fallback for dev

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const running = await PipelineRun.findOne({ status: "running" }).lean();
    if (running) {
      return NextResponse.json({ error: "Pipeline already running" }, { status: 409 });
    }

    // Fire and forget
    runScheduledGeneration().catch((error) => {
      console.error("Cron idea generation failed:", error);
    });

    return NextResponse.json({ message: "Idea pipeline generation started in background." });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
