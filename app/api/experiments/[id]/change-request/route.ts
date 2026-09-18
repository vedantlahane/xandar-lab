// app/api/experiments/[id]/change-request/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Experiment from "@/models/Experiment";
import { getSession } from "@/lib/auth";
import { isModeratorOrAdmin } from "@/lib/rbac";
import type { UserRole } from "@/lib/rbac";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.role as UserRole | undefined;
        if (!isModeratorOrAdmin(userRole)) {
            return NextResponse.json({ error: "Only admins and moderators can request changes from authors" }, { status: 403 });
        }

        const { id } = await params;
        const { message } = await request.json();

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "A message describing the requested changes is required" }, { status: 400 });
        }

        await connectDB();

        // If it's not an ObjectId, handle curated seed experiment by creating document
        let experiment: any;
        if (!mongoose.isValidObjectId(id)) {
            experiment = await Experiment.create({
                title: `Curated Experiment #${id}`,
                description: "Curated experiment description",
                type: "Full Stack",
                status: "Active",
                visibility: "public",
                isCurated: true,
                authorId: session.userId,
                authorUsername: "Xandar Curated",
                authorRole: "admin",
            });
        } else {
            experiment = await Experiment.findById(id);
        }

        if (!experiment) {
            return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
        }

        const newRequest = {
            requestedBy: session.username || "Admin",
            requestedById: new mongoose.Types.ObjectId(session.userId),
            requestedByRole: session.role || "admin",
            message: message.trim(),
            status: "pending" as const,
            createdAt: new Date(),
        };

        if (!experiment.changeRequests) {
            experiment.changeRequests = [];
        }

        experiment.changeRequests.push(newRequest);
        await experiment.save();

        return NextResponse.json({
            success: true,
            changeRequests: experiment.changeRequests,
            experimentId: experiment._id.toString(),
        });
    } catch (error: any) {
        console.error("POST /api/experiments/[id]/change-request error:", error);
        return NextResponse.json({ error: error.message || "Failed to submit change request" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid experiment ID" }, { status: 400 });
        }

        const { requestId } = await request.json();
        await connectDB();

        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
        }

        const userRole = session.role as UserRole | undefined;
        const isAuthor = experiment.authorId && experiment.authorId.toString() === session.userId;
        const isModOrAdmin = isModeratorOrAdmin(userRole);

        if (!isAuthor && !isModOrAdmin) {
            return NextResponse.json({ error: "Forbidden: You cannot resolve this request" }, { status: 403 });
        }

        if (!experiment.changeRequests || experiment.changeRequests.length === 0) {
            return NextResponse.json({ error: "No change requests found" }, { status: 404 });
        }

        let targetRequest: any;
        if (requestId) {
            targetRequest = experiment.changeRequests.id ? experiment.changeRequests.id(requestId) : experiment.changeRequests.find((r: any) => r._id?.toString() === requestId);
        } else {
            targetRequest = experiment.changeRequests.slice().reverse().find((r: any) => r.status === "pending");
        }

        if (!targetRequest) {
            return NextResponse.json({ error: "Change request not found" }, { status: 404 });
        }

        targetRequest.status = "resolved";
        targetRequest.resolvedAt = new Date();
        await experiment.save();

        return NextResponse.json({
            success: true,
            changeRequests: experiment.changeRequests,
        });
    } catch (error: any) {
        console.error("PATCH /api/experiments/[id]/change-request error:", error);
        return NextResponse.json({ error: error.message || "Failed to resolve change request" }, { status: 500 });
    }
}
