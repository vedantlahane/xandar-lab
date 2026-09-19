import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notebook from "@/models/Notebook";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const notebooks = await Notebook.find({ authorId: session.userId }).sort({ createdAt: -1 });

        return NextResponse.json({
            notebooks: notebooks.map(n => ({
                id: n._id.toString(),
                name: n.name,
                parentId: n.parentId?.toString(),
                icon: n.icon,
                color: n.color,
                createdAt: n.createdAt,
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, parentId, icon, color } = await request.json();

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await connectDB();
        
        const notebook = await Notebook.create({
            name: name.trim(),
            authorId: session.userId,
            parentId: parentId || undefined,
            icon: icon || undefined,
            color: color || "default",
        });

        return NextResponse.json({
            notebook: {
                id: notebook._id.toString(),
                name: notebook.name,
                parentId: notebook.parentId?.toString(),
                icon: notebook.icon,
                color: notebook.color,
                createdAt: notebook.createdAt,
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
