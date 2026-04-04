import { NextResponse } from "next/server";
import { z } from "zod";
import { getValidatedSession } from "@/lib/auth";
import { runIdeaForgePipeline } from "@/lib/ideas/pipeline";
import { getRateLimitStatus } from "@/lib/ideas/rateLimit";
import type { ForgeInput } from "@/lib/ideas/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const requestSchema = z.object({
  domain: z.string().min(2).max(120),
  skills: z.array(z.string().min(1).max(40)).min(1).max(25),
  preferences: z
    .object({
      timeline: z.enum(["1 week", "2-4 weeks", "1-2 months"]).optional(),
      goal: z.enum(["learn_portfolio", "side_project", "potential_startup"]).optional(),
      monetization: z.enum(["not_important", "nice_to_have", "primary_goal"]).optional(),
    })
    .optional(),
});

function getRequesterKey(req: Request, userId: string | null) {
  if (userId) return `user:${userId}`;

  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const firstIp = forwardedFor.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const ip = firstIp || realIp || "anonymous";

  return `ip:${ip}`;
}

function serializeSseEvent(event: string, data: Record<string, unknown>) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  let jsonBody: unknown;

  try {
    jsonBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(jsonBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const session = await getValidatedSession();
  const requesterKey = getRequesterKey(req, session?.userId ?? null);
  const rateLimit = getRateLimitStatus(requesterKey);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Try again later.",
        resetAt: new Date(rateLimit.resetAt).toISOString(),
      },
      { status: 429 }
    );
  }

  const input: ForgeInput = {
    domain: parsed.data.domain.trim(),
    skills: parsed.data.skills.map((skill) => skill.trim()).filter(Boolean),
    preferences: parsed.data.preferences,
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(serializeSseEvent(event, data)));
      };

      void (async () => {
        send("agent_thinking", {
          agent: "system",
          thought: "Idea Forge pipeline initialized.",
        });

        try {
          await runIdeaForgePipeline({
            input,
            emit(payload) {
              send(payload.event, payload.data);
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown pipeline error";

          send("agent_error", {
            agent: "system",
            error: message,
          });

          send("complete", {
            ideas: [],
            deliberation_log: [
              {
                timestamp: new Date().toISOString(),
                agent: "system",
                level: "error",
                message,
              },
            ],
          });
        } finally {
          controller.close();
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(rateLimit.resetAt),
    },
  });
}
