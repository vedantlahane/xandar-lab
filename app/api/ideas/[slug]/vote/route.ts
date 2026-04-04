import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import VoteLog from "@/models/VoteLog";
import { createHash } from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { type } = await request.json();
    const { slug } = await params;

    if (type !== "upvote" && type !== "bookmark") {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    await connectDB();

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
             || request.headers.get("x-real-ip")
             || "anonymous";
    const voterKey = createHash("sha256").update(ip).digest("hex").slice(0, 16);

    try {
      await VoteLog.create({
          ideaSlug: slug,
          voterKey,
          voteType: type,
      });
    } catch (err: any) {
      if (err.code === 11000) {
          return NextResponse.json(
              { error: "Already voted" },
              { status: 409 }
          );
      }
      throw err;
    }

    const updateField = type === "upvote" ? { upvotes: 1 } : { bookmarks: 1 };

    const updatedIdea = await Idea.findOneAndUpdate(
      { slug },
      { $inc: updateField },
      { new: true, select: "upvotes bookmarks" }
    ).lean();

    if (!updatedIdea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json({
      upvotes: updatedIdea.upvotes,
      bookmarks: updatedIdea.bookmarks
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
