import { Metadata } from "next";
import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import ClientPage from "./ClientPage";

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    await connectDB();
    const { slug } = await params;
    const idea = await Idea.findOne({ slug, status: "published" }).lean();

    if (!idea) {
        return {
            title: "Idea Not Found — Xandar Lab",
        };
    }

    const description = idea.problem.length > 160
        ? idea.problem.slice(0, 157) + "..."
        : idea.problem;

    return {
        title: `${idea.title} — Xandar Ideas`,
        description,
        openGraph: {
            title: idea.title,
            description,
            type: "article",
            siteName: "Xandar Lab",
            tags: [...idea.tags, idea.domain],
        },
        twitter: {
            card: "summary",
            title: idea.title,
            description,
        },
    };
}

export default function IdeaDetailPageWrapper() {
    return <ClientPage />;
}
