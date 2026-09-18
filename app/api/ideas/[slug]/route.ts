import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import { getSession } from "@/lib/auth";
import { canEditResource, canDeleteResource, isAdmin } from "@/lib/rbac";
import type { UserRole } from "@/lib/rbac";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const idea = await Idea.findOne({ slug }).lean();

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const response = NextResponse.json(idea);
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const userRole = session.role as UserRole | undefined;

    await connectDB();
    const idea = await Idea.findOne({ slug });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (!canEditResource(session.userId, userRole, idea.authorId?.toString())) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions to edit this idea" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      problem,
      solution,
      targetUser,
      timeline,
      domain,
      techStack,
      monetization,
      risks,
      confidence,
      complexity,
      isPinned,
      isCurated,
      status,
    } = body;

    if (title !== undefined) idea.title = title.trim();
    if (problem !== undefined) idea.problem = problem.trim();
    if (solution !== undefined) idea.solution = solution.trim();
    if (targetUser !== undefined) idea.targetUser = targetUser.trim();
    if (timeline !== undefined) idea.timeline = timeline;
    if (domain !== undefined) idea.domain = domain.trim();
    if (techStack !== undefined) {
      idea.techStack = Array.isArray(techStack) ? techStack : [];
      idea.tags = idea.techStack;
    }
    if (monetization !== undefined) idea.monetization = monetization;
    if (risks !== undefined) idea.risks = risks;
    if (confidence !== undefined) idea.confidence = Number(confidence);
    if (complexity !== undefined) idea.complexity = complexity;
    if (isPinned !== undefined && (userRole === "admin" || userRole === "moderator")) {
      idea.isPinned = !!isPinned;
    }
    if (isCurated !== undefined && userRole === "admin") {
      idea.isCurated = !!isCurated;
    }
    if (status !== undefined) idea.status = status;

    await idea.save();

    return NextResponse.json({ success: true, idea });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update idea" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const userRole = session.role as UserRole | undefined;

    await connectDB();
    const idea = await Idea.findOne({ slug });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (!canDeleteResource(session.userId, userRole, idea.authorId?.toString())) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions to delete this idea" }, { status: 403 });
    }

    await Idea.findOneAndDelete({ slug });

    return NextResponse.json({ success: true, message: "Idea deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete idea" },
      { status: 500 }
    );
  }
}
