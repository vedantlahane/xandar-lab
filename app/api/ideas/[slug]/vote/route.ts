import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { type } = await request.json();
    const slug = params.slug;

    if (type !== "upvote" && type !== "bookmark") {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    await connectDB();

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
