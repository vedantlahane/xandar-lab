import connectDB from "@/lib/db";
import Idea from "@/models/Idea";
import PipelineRun from "@/models/PipelineRun";
import { runIdeaForgePipeline } from "@/lib/ideaforge/pipeline";
import type { FinalIdea, ForgeState, ForgeStreamEvent } from "@/lib/ideaforge/types";

export const SCHEDULED_DOMAINS = [
  "developer-tools",
  "fintech",
  "healthtech",
  "edtech",
  "ai-ml-tools",
  "devops",
  "e-commerce",
  "productivity",
  "open-source",
  "saas",
  "mobile-apps",
  "cybersecurity",
  "data-engineering",
  "automation",
] as const;

const DEFAULT_DELAY_MS = 5000;

type SchedulerOptions = {
  domains?: string[];
  delayMs?: number;
};

export type SchedulerSummary = {
  domainsProcessed: number;
  ideasGenerated: number;
  ideasSaved: number;
  duplicatesSkipped: number;
  failedDomains: string[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toDomainTitle(domain: string) {
  return domain
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSimilarity(a: string, b: string) {
  const aSet = new Set(normalizeText(a).split(" ").filter(Boolean));
  const bSet = new Set(normalizeText(b).split(" ").filter(Boolean));

  if (aSet.size === 0 || bSet.size === 0) return 0;

  let overlap = 0;
  for (const token of aSet) {
    if (bSet.has(token)) overlap += 1;
  }

  return overlap / Math.max(aSet.size, bSet.size);
}

function inferComplexity(idea: FinalIdea): "low" | "medium" | "high" {
  const timeline = (idea.mvpScope?.timeline || "").toLowerCase();

  if (timeline.includes("1 week")) return "low";
  if (timeline.includes("1-2 months") || timeline.includes("month")) return "high";
  if (timeline.includes("2-4 weeks") || timeline.includes("week")) return "medium";

  const stackCount = idea.suggestedTechStack?.length || 0;
  if (stackCount >= 6) return "high";
  if (stackCount <= 3) return "low";
  return "medium";
}

function buildTags(domain: string, idea: FinalIdea) {
  const tags = new Set<string>();

  for (const part of domain.split("-")) {
    if (part) tags.add(part.toLowerCase());
  }

  for (const tech of idea.suggestedTechStack || []) {
    const cleaned = tech.toLowerCase().trim();
    if (cleaned) tags.add(cleaned);
  }

  const words = normalizeText(idea.title)
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 5);

  for (const word of words) {
    tags.add(word);
  }

  return Array.from(tags).slice(0, 12);
}

async function createUniqueSlug(base: string) {
  let candidate = base || `idea-${Date.now()}`;
  let cursor = 2;

  while (true) {
    const existing = await Idea.findOne({ slug: candidate }).select({ _id: 1 }).lean();
    if (!existing) return candidate;
    candidate = `${base}-${cursor}`;
    cursor += 1;
  }
}

function mapEvidence(idea: FinalIdea) {
  return (idea.evidence || []).map((item) => ({
    source: item.label,
    url: item.url,
    snippet: item.note || "",
  }));
}

function stringifyRisks(idea: FinalIdea) {
  if (!idea.risks || idea.risks.length === 0) return "";
  return idea.risks.join("\n");
}

async function processDomain(domain: string) {
  const run = await PipelineRun.create({
    domain,
    status: "running",
    ideasGenerated: 0,
    ideasSurvived: 0,
    iterationsUsed: 0,
  });

  const startedAt = Date.now();
  const events: ForgeStreamEvent[] = [];

  try {
    const state = await runIdeaForgePipeline({
      input: {
        domain,
        skills: [],
        preferences: {
          timeline: "2-4 weeks",
          goal: "side_project",
        },
      },
      emit(payload) {
        events.push(payload);
      },
    });

    const existingTitles = await Idea.find({ domain }).select({ title: 1 }).lean();
    const finalIdeas = state.finalIdeas || [];

    let saved = 0;
    let skipped = 0;

    for (const finalIdea of finalIdeas) {
      const duplicate = existingTitles.some((entry) => {
        const similarity = tokenSimilarity(entry.title, finalIdea.title);
        return similarity >= 0.85;
      });

      if (duplicate) {
        skipped += 1;
        continue;
      }

      const baseSlug = slugify(finalIdea.title);
      const slug = await createUniqueSlug(baseSlug);

      const marketForIdea = (state.marketValidation || []).find(
        (item) => item.ideaId === finalIdea.id
      );
      const techForIdea = (state.techAssessment || []).find(
        (item) => item.ideaId === finalIdea.id
      );

      await Idea.create({
        title: finalIdea.title,
        slug,
        problem: finalIdea.problem,
        solution: finalIdea.solution,
        targetUser: finalIdea.targetUser,
        whyNow: finalIdea.summary,
        domain,
        tags: buildTags(domain, finalIdea),
        confidence: finalIdea.confidenceScore,
        complexity: inferComplexity(finalIdea),
        timeline: finalIdea.mvpScope?.timeline || "2-4 weeks",
        techStack: finalIdea.suggestedTechStack || [],
        monetization: finalIdea.monetization || "",
        risks: stringifyRisks(finalIdea),
        evidence: mapEvidence(finalIdea),
        marketData: marketForIdea || {},
        techReview: techForIdea || {},
        batchId: run._id.toString(),
        iteration: state.iterationCount || 1,
      });

      existingTitles.push({ title: finalIdea.title } as { title: string });
      saved += 1;
    }

    const durationMs = Date.now() - startedAt;

    await PipelineRun.findByIdAndUpdate(run._id, {
      status: "completed",
      ideasGenerated: finalIdeas.length,
      ideasSurvived: finalIdeas.length,
      iterationsUsed: state.iterationCount || 1,
      durationMs,
      deliberation: {
        events,
        logs: state.deliberationLog,
        domainLabel: toDomainTitle(domain),
        duplicatesSkipped: skipped,
      },
    });

    return {
      generated: finalIdeas.length,
      saved,
      skipped,
      state,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : "Unknown scheduler error";

    await PipelineRun.findByIdAndUpdate(run._id, {
      status: "failed",
      durationMs,
      error: message,
      deliberation: {
        events,
      },
    });

    throw error;
  }
}

export async function runScheduledGeneration(
  options: SchedulerOptions = {}
): Promise<SchedulerSummary> {
  await connectDB();

  const domains = (options.domains && options.domains.length > 0
    ? options.domains
    : [...SCHEDULED_DOMAINS]
  ).map((item) => item.toLowerCase());

  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;

  const summary: SchedulerSummary = {
    domainsProcessed: 0,
    ideasGenerated: 0,
    ideasSaved: 0,
    duplicatesSkipped: 0,
    failedDomains: [],
  };

  for (let index = 0; index < domains.length; index += 1) {
    const domain = domains[index];

    try {
      const domainResult = await processDomain(domain);

      summary.domainsProcessed += 1;
      summary.ideasGenerated += domainResult.generated;
      summary.ideasSaved += domainResult.saved;
      summary.duplicatesSkipped += domainResult.skipped;
    } catch (error) {
      console.error(`Idea generation failed for domain: ${domain}`, error);
      summary.failedDomains.push(domain);
    }

    if (index < domains.length - 1) {
      await sleep(delayMs);
    }
  }

  return summary;
}
