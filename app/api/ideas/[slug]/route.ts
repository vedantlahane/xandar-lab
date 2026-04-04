import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const idea = await Idea.findOne({ slug, status: "published" }).lean();

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const response = NextResponse.json(idea);
    response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
