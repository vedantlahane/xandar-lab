import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { END, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import {
  buildCriticUserPrompt,
  buildIdeatorUserPrompt,
  buildMarketUserPrompt,
  buildScoutUserPrompt,
  buildSynthUserPrompt,
  buildTechUserPrompt,
  criticSystemPrompt,
  ideatorSystemPrompt,
  marketSystemPrompt,
  scoutSystemPrompt,
  synthSystemPrompt,
  techSystemPrompt,
} from "@/lib/ideas/prompts";
import { invokeJsonModel } from "@/lib/ideas/llm";
import { searchTavily } from "@/lib/ideas/tavily";
import { getQueriesForDomain } from "@/lib/ideas/domainQueries";
import { getCachedSignals, setCachedSignals } from "@/lib/ideas/signalCache";
import type {
  AgentName,
  Critique,
  FinalIdea,
  ForgeInput,
  ForgeState,
  ForgeStreamEvent,
  Idea,
  LogEntry,
  MarketValidation,
  Signal,
  TechAssessment,
} from "@/lib/ideas/types";

const ForgeStateSchema = z.object({
  domain: z.string(),
  skills: z.array(z.string()),
  preferences: z.object({
    timeline: z.enum(["1 week", "2-4 weeks", "1-2 months"]).optional(),
    goal: z.enum(["learn_portfolio", "side_project", "potential_startup"]).optional(),
    monetization: z
      .enum(["not_important", "nice_to_have", "primary_goal"])
      .optional(),
  }),

  signals: z.array(
    z.object({
      summary: z.string(),
      painPoint: z.string(),
      sourceUrl: z.string(),
      sourceTitle: z.string().optional(),
      evidenceSnippet: z.string().optional(),
      confidence: z.number(),
    })
  ),
  ideas: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      problem: z.string(),
      solution: z.string(),
      targetUser: z.string(),
      whyYou: z.string(),
      confidenceScore: z.number(),
      suggestedTechStack: z.array(z.string()),
    })
  ),
  critiques: z.array(
    z.object({
      ideaId: z.string(),
      verdict: z.enum(["KILL", "REVISE", "PROCEED"]),
      competitors: z.array(z.string()),
      fatalFlaws: z.array(z.string()),
      feedback: z.string(),
    })
  ),
  marketValidation: z.array(
    z.object({
      ideaId: z.string(),
      demandSignals: z.array(z.string()),
      competitors: z.array(
        z.object({
          name: z.string(),
          pricing: z.string(),
          positioning: z.string(),
        })
      ),
      trend: z.enum(["growing", "stable", "shrinking"]),
      evidence: z.array(
        z.object({
          label: z.string(),
          url: z.string(),
          note: z.string().optional(),
        })
      ),
      score: z.number(),
    })
  ),
  techAssessment: z.array(
    z.object({
      ideaId: z.string(),
      feasibilityScore: z.number(),
      suggestedTechStack: z.array(z.string()),
      mvpTimeline: z.string(),
      keyMilestones: z.array(z.string()),
      hardestChallenge: z.string(),
      skillFit: z.string(),
    })
  ),
  finalIdeas: z.array(
    z.object({
      id: z.string(),
      confidenceScore: z.number(),
      title: z.string(),
      problem: z.string(),
      solution: z.string(),
      targetUser: z.string(),
      whyYou: z.string(),
      suggestedTechStack: z.array(z.string()),
      mvpScope: z.object({
        timeline: z.string(),
        keyMilestones: z.array(z.string()),
      }),
      monetization: z.string(),
      risks: z.array(z.string()),
      evidence: z.array(
        z.object({
          label: z.string(),
          url: z.string(),
          note: z.string().optional(),
        })
      ),
      summary: z.string(),
    })
  ),

  currentAgent: z.enum([
    "idle",
    "scout",
    "ideator",
    "critic",
    "market_check",
    "tech_review",
    "synthesizer",
  ]),
  iterationCount: z.number(),
  maxIterations: z.number(),
  feedbackToIdeator: z.string().nullable(),
  shouldIterate: z.boolean(),

  deliberationLog: z.array(
    z.object({
      timestamp: z.string(),
      agent: z.enum([
        "system",
        "scout",
        "ideator",
        "critic",
        "market_check",
        "tech_review",
        "synthesizer",
      ]),
      level: z.enum(["info", "warning", "error"]),
      message: z.string(),
      details: z.unknown().optional(),
    })
  ),
});

type ForgeGraphState = z.infer<typeof ForgeStateSchema>;

export type PipelineEventEmitter = (event: ForgeStreamEvent) => void;

function nowIso() {
  return new Date().toISOString();
}

function makeLog(
  agent: AgentName | "system",
  level: "info" | "warning" | "error",
  message: string,
  details?: unknown
): LogEntry {
  return {
    timestamp: nowIso(),
    agent,
    level,
    message,
    ...(details !== undefined ? { details } : {}),
  };
}

function clampScore(value: number, fallback = 50) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function pickFallbackSignals(raw: Array<{ title: string; url: string; content: string }>): Signal[] {
  return raw.slice(0, 10).map((item) => ({
    summary: item.title || "Observed recurring pain signal",
    painPoint: item.content || "Users report friction in existing workflows",
    sourceUrl: item.url || "https://example.com",
    sourceTitle: item.title || "Signal",
    evidenceSnippet: item.content?.slice(0, 240) || "",
    confidence: 58,
  }));
}

function sanitizeSignals(signals: Signal[]): Signal[] {
  const unique = new Map<string, Signal>();

  for (const signal of signals) {
    const key = `${signal.summary}-${signal.sourceUrl}`.toLowerCase();
    if (!signal.summary || !signal.sourceUrl) continue;

    unique.set(key, {
      summary: signal.summary,
      painPoint: signal.painPoint || signal.summary,
      sourceUrl: signal.sourceUrl,
      sourceTitle: signal.sourceTitle || "Signal",
      evidenceSnippet: signal.evidenceSnippet || "",
      confidence: clampScore(signal.confidence, 55),
    });
  }

  return Array.from(unique.values()).slice(0, 12);
}

function sanitizeIdeas(ideas: Idea[], iteration: number): Idea[] {
  return ideas.slice(0, 5).map((idea, index) => ({
    id: idea.id || `idea-r${iteration}-${index + 1}`,
    title: idea.title || `Idea ${index + 1}`,
    problem: idea.problem || "Problem statement unavailable",
    solution: idea.solution || "Solution statement unavailable",
    targetUser: idea.targetUser || "Developers",
    whyYou: idea.whyYou || "Skill alignment needs refinement",
    confidenceScore: clampScore(idea.confidenceScore, 60),
    suggestedTechStack:
      idea.suggestedTechStack && idea.suggestedTechStack.length > 0
        ? idea.suggestedTechStack
        : ["Next.js", "TypeScript"],
  }));
}

function sanitizeCritiques(critiques: Critique[], ideas: Idea[]): Critique[] {
  const map = new Map(critiques.map((c) => [c.ideaId, c]));

  return ideas.map((idea) => {
    const critique = map.get(idea.id);
    if (!critique) {
      return {
        ideaId: idea.id,
        verdict: "REVISE",
        competitors: [],
        fatalFlaws: ["Missing explicit critique response"],
        feedback: "Add stronger differentiation and sharper ICP.",
      };
    }

    return {
      ideaId: idea.id,
      verdict: critique.verdict,
      competitors: critique.competitors || [],
      fatalFlaws: critique.fatalFlaws || [],
      feedback: critique.feedback || "No detailed feedback provided.",
    };
  });
}

function survivingIdeasFromState(state: ForgeGraphState) {
  const verdictByIdea = new Map(state.critiques.map((item) => [item.ideaId, item.verdict]));
  return state.ideas.filter((idea) => {
    const verdict = verdictByIdea.get(idea.id);
    return verdict === "PROCEED" || verdict === "REVISE";
  });
}

function sanitizeMarketValidation(validations: MarketValidation[], ideas: Idea[]): MarketValidation[] {
  const ideaIds = new Set(ideas.map((idea) => idea.id));

  return validations
    .filter((item) => ideaIds.has(item.ideaId))
    .map((item) => ({
      ideaId: item.ideaId,
      demandSignals: item.demandSignals?.slice(0, 5) || [],
      competitors: item.competitors?.slice(0, 5) || [],
      trend: item.trend || "stable",
      evidence: (item.evidence || []).slice(0, 6),
      score: clampScore(item.score, 55),
    }));
}

function sanitizeTechAssessment(assessments: TechAssessment[], ideas: Idea[]): TechAssessment[] {
  const ideaIds = new Set(ideas.map((idea) => idea.id));

  return assessments
    .filter((item) => ideaIds.has(item.ideaId))
    .map((item) => ({
      ideaId: item.ideaId,
      feasibilityScore: clampScore(item.feasibilityScore, 60),
      suggestedTechStack: item.suggestedTechStack?.length
        ? item.suggestedTechStack
        : ["Next.js", "Node.js", "PostgreSQL"],
      mvpTimeline: item.mvpTimeline || "2-4 weeks",
      keyMilestones: item.keyMilestones?.length
        ? item.keyMilestones
        : ["Prototype core workflow", "Ship MVP", "Collect user feedback"],
      hardestChallenge: item.hardestChallenge || "Distribution and onboarding",
      skillFit: item.skillFit || "Moderate fit",
    }));
}

function fallbackFinalIdeas(
  ideas: Idea[],
  marketValidation: MarketValidation[],
  techAssessment: TechAssessment[]
): FinalIdea[] {
  const marketMap = new Map(marketValidation.map((item) => [item.ideaId, item]));
  const techMap = new Map(techAssessment.map((item) => [item.ideaId, item]));

  return ideas.slice(0, 3).map((idea) => {
    const market = marketMap.get(idea.id);
    const tech = techMap.get(idea.id);

    const blendedScore = clampScore(
      Math.round((idea.confidenceScore + (market?.score ?? 55) + (tech?.feasibilityScore ?? 60)) / 3),
      idea.confidenceScore
    );

    return {
      id: idea.id,
      confidenceScore: blendedScore,
      title: idea.title,
      problem: idea.problem,
      solution: idea.solution,
      targetUser: idea.targetUser,
      whyYou: idea.whyYou,
      suggestedTechStack: tech?.suggestedTechStack?.length
        ? tech.suggestedTechStack
        : idea.suggestedTechStack,
      mvpScope: {
        timeline: tech?.mvpTimeline || "2-4 weeks",
        keyMilestones: tech?.keyMilestones || [
          "Validate problem interviews",
          "Build MVP",
          "Launch with pilot users",
        ],
      },
      monetization: "Freemium with paid power-user tier.",
      risks: [
        "Acquisition could be slower than expected",
        "Competitors may react quickly",
      ],
      evidence: market?.evidence || [],
      summary: `A focused build targeting ${idea.targetUser} with clear MVP boundaries.`,
    };
  });
}

function sortFinalIdeas(ideas: FinalIdea[]): FinalIdea[] {
  return [...ideas].sort((a, b) => b.confidenceScore - a.confidenceScore);
}

export function createInitialForgeState(input: ForgeInput): ForgeState {
  return {
    domain: input.domain,
    skills: input.skills,
    preferences: input.preferences || {},

    signals: [],
    ideas: [],
    critiques: [],
    marketValidation: [],
    techAssessment: [],
    finalIdeas: [],

    currentAgent: "idle",
    iterationCount: 1,
    maxIterations: 3,
    feedbackToIdeator: null,
    shouldIterate: false,

    deliberationLog: [
      makeLog("system", "info", "Idea Forge run started", {
        domain: input.domain,
        skillCount: input.skills.length,
      }),
    ],
  };
}

export async function runIdeaForgePipeline(params: {
  input: ForgeInput;
  emit: PipelineEventEmitter;
}): Promise<ForgeState> {
  const { input, emit } = params;

  const graph = new StateGraph(ForgeStateSchema)
    .addNode("scout", async (state: ForgeGraphState): Promise<Partial<ForgeGraphState>> => {
      emit({
        event: "agent_start",
        data: {
          agent: "scout",
          message: "Scanning the internet for signals...",
        },
      });

      const log = [...state.deliberationLog];

      const cached = await getCachedSignals(state.domain);
      if (cached && cached.length > 0) {
        emit({
          event: "agent_thinking",
          data: {
            agent: "scout",
            thought: `Using cached signals (${cached.length} signals from recent scan)`,
          },
        });
        emit({
          event: "agent_complete",
          data: {
            agent: "scout",
            result: { signalCount: cached.length },
          },
        });
        log.push(makeLog("scout", "info", "Scout completed using cache"));
        return {
          currentAgent: "scout",
          signals: cached,
          deliberationLog: log,
        };
      }

      const queries = getQueriesForDomain(state.domain);

      const rawFindings: Array<{
        query: string;
        title: string;
        url: string;
        content: string;
      }> = [];

      for (const query of queries) {
        emit({
          event: "agent_thinking",
          data: {
            agent: "scout",
            thought: `Querying Tavily: ${query}`,
          },
        });

        try {
          const results = await searchTavily(query);
          for (const item of results) {
            rawFindings.push({
              query,
              title: item.title,
              url: item.url,
              content: item.content,
            });
          }

          emit({
            event: "agent_thinking",
            data: {
              agent: "scout",
              thought: `Collected ${results.length} results for query: ${query}`,
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Scout query failed";
          emit({
            event: "agent_error",
            data: {
              agent: "scout",
              error: message,
            },
          });
          log.push(makeLog("scout", "warning", "Scout query failed", { query, message }));
        }
      }

      const filtered = await invokeJsonModel<{ signals: Signal[] }>({
        messages: [
          new SystemMessage(scoutSystemPrompt),
          new HumanMessage(
            buildScoutUserPrompt({
              domain: state.domain,
              skills: state.skills,
              rawFindings,
            })
          ),
        ],
        fallback: { signals: [] },
      });

      let signals = sanitizeSignals(filtered.data.signals || []);
      if (signals.length === 0) {
        signals = pickFallbackSignals(rawFindings);
      }

      if (signals.length === 0) {
        signals = [
          {
            summary: `Users in ${state.domain} are asking for faster workflows`,
            painPoint: "Current tooling is fragmented and expensive",
            sourceUrl: "https://news.ycombinator.com",
            sourceTitle: "Fallback community signal",
            evidenceSnippet: "Repeated discussion around tool fatigue and integration gaps",
            confidence: 52,
          },
        ];
      }

      emit({
        event: "agent_complete",
        data: {
          agent: "scout",
          result: {
            signalCount: signals.length,
          },
        },
      });

      log.push(
        makeLog("scout", "info", "Scout completed", {
          signalCount: signals.length,
          usedFallback: filtered.usedFallback,
          llmError: filtered.error,
        })
      );

      await setCachedSignals(state.domain, signals);

      return {
        currentAgent: "scout",
        signals,
        deliberationLog: log,
      };
    })
    .addNode("ideator", async (state: ForgeGraphState): Promise<Partial<ForgeGraphState>> => {
      emit({
        event: "agent_start",
        data: {
          agent: "ideator",
          message: "Brainstorming original ideas...",
        },
      });

      const log = [...state.deliberationLog];
      emit({
        event: "agent_thinking",
        data: {
          agent: "ideator",
          thought:
            state.iterationCount > 1
              ? `Iteration ${state.iterationCount}: generating alternatives based on critic feedback`
              : "Generating first-pass idea set from validated signals",
        },
      });

      const generated = await invokeJsonModel<{ ideas: Idea[] }>({
        messages: [
          new SystemMessage(ideatorSystemPrompt),
          new HumanMessage(
            buildIdeatorUserPrompt({
              state,
              feedback: state.feedbackToIdeator,
            })
          ),
        ],
        fallback: {
          ideas: [
            {
              id: `idea-r${state.iterationCount}-1`,
              title: `${state.domain} Workflow Copilot`,
              problem: `Teams in ${state.domain} lose time switching tools and context`,
              solution: "An AI assistant that automates repetitive coordination tasks",
              targetUser: "Independent builders and small product teams",
              whyYou: `Strong alignment with your skills: ${state.skills.join(", ")}`,
              confidenceScore: 64,
              suggestedTechStack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
            },
            {
              id: `idea-r${state.iterationCount}-2`,
              title: `${state.domain} Insight Radar`,
              problem: `Signals in ${state.domain} are scattered across communities and docs`,
              solution: "Aggregate and score real market pain from public discussions",
              targetUser: "Product managers and founders",
              whyYou: "Your skill set supports fast MVP delivery for analytics workflows",
              confidenceScore: 62,
              suggestedTechStack: ["Python", "FastAPI", "React", "Supabase"],
            },
            {
              id: `idea-r${state.iterationCount}-3`,
              title: `${state.domain} Launch Brief Builder`,
              problem: "Builders struggle to convert rough ideas into execution plans",
              solution: "Generate research-backed launch plans with milestones and risk checks",
              targetUser: "Solo founders and indie hackers",
              whyYou: "Strong overlap with full-stack and cloud-oriented execution",
              confidenceScore: 60,
              suggestedTechStack: ["Next.js", "Node.js", "MongoDB", "OpenAI"],
            },
            {
              id: `idea-r${state.iterationCount}-4`,
              title: `${state.domain} Validation Sprint Kit`,
              problem: "Many projects ship before validating demand",
              solution: "A guided workflow that runs demand validation sprints in days",
              targetUser: "Early-stage builders",
              whyYou: "A practical fit for your product + engineering hybrid profile",
              confidenceScore: 59,
              suggestedTechStack: ["React", "TypeScript", "Firebase"],
            },
            {
              id: `idea-r${state.iterationCount}-5`,
              title: `${state.domain} Onboarding Optimizer`,
              problem: "New users drop off because activation flows are generic",
              solution: "Adaptive onboarding that reacts to user intent and role",
              targetUser: "SaaS teams with self-serve products",
              whyYou: "You can deliver this with standard web stack and analytics tooling",
              confidenceScore: 58,
              suggestedTechStack: ["Next.js", "Redis", "PostHog"],
            },
          ],
        },
      });

      const ideas = sanitizeIdeas(generated.data.ideas || [], state.iterationCount);

      emit({
        event: "agent_complete",
        data: {
          agent: "ideator",
          result: {
            ideaCount: ideas.length,
            titles: ideas.map((idea) => idea.title),
          },
        },
      });

      log.push(
        makeLog("ideator", "info", "Ideator completed", {
          ideaCount: ideas.length,
          usedFallback: generated.usedFallback,
          llmError: generated.error,
        })
      );

      return {
        currentAgent: "ideator",
        ideas,
        shouldIterate: false,
        deliberationLog: log,
      };
    })
    .addNode("critic", async (state: ForgeGraphState): Promise<Partial<ForgeGraphState>> => {
      emit({
        event: "agent_start",
        data: {
          agent: "critic",
          message: "Challenging every idea ruthlessly...",
        },
      });

      const log = [...state.deliberationLog];

      const reviewed = await invokeJsonModel<{ critiques: Critique[] }>({
        messages: [
          new SystemMessage(criticSystemPrompt),
          new HumanMessage(buildCriticUserPrompt(state.ideas, state.signals)),
        ],
        fallback: {
          critiques: state.ideas.map((idea) => ({
            ideaId: idea.id,
            verdict: "REVISE" as const,
            competitors: [],
            fatalFlaws: ["No rigorous competitor benchmark provided"],
            feedback: "Tighten problem specificity and differentiation before proceeding.",
          })),
        },
      });

      const critiques = sanitizeCritiques(reviewed.data.critiques || [], state.ideas);
      const proceedOrRevise = critiques.filter(
        (item) => item.verdict === "PROCEED" || item.verdict === "REVISE"
      );
      const allKilled = critiques.length > 0 && proceedOrRevise.length === 0;

      let shouldIterate = false;
      let nextIteration = state.iterationCount;
      let feedbackToIdeator: string | null = null;

      if (allKilled && state.iterationCount < state.maxIterations) {
        shouldIterate = true;
        nextIteration = state.iterationCount + 1;
        feedbackToIdeator = critiques.map((item) => item.feedback).join("\n");

        emit({
          event: "iteration",
          data: {
            round: nextIteration,
            reason: "Ideas did not survive critique. Iterating with feedback.",
          },
        });
      }

      emit({
        event: "agent_complete",
        data: {
          agent: "critic",
          result: {
            proceed: critiques.filter((item) => item.verdict === "PROCEED").length,
            revise: critiques.filter((item) => item.verdict === "REVISE").length,
            kill: critiques.filter((item) => item.verdict === "KILL").length,
          },
        },
      });

      log.push(
        makeLog("critic", "info", "Critic completed", {
          shouldIterate,
          nextIteration,
          usedFallback: reviewed.usedFallback,
          llmError: reviewed.error,
        })
      );

      return {
        currentAgent: "critic",
        critiques,
        shouldIterate,
        iterationCount: nextIteration,
        feedbackToIdeator,
        deliberationLog: log,
      };
    })
    .addNode("market_check", async (state: ForgeGraphState): Promise<Partial<ForgeGraphState>> => {
      emit({
        event: "agent_start",
        data: {
          agent: "market_check",
          message: "Validating market demand...",
        },
      });

      const log = [...state.deliberationLog];
      const survivingIdeas = survivingIdeasFromState(state);

      if (survivingIdeas.length === 0) {
        emit({
          event: "agent_thinking",
          data: {
            agent: "market_check",
            thought: "No surviving ideas from critic. Skipping market validation.",
          },
        });

        log.push(makeLog("market_check", "warning", "Skipped due to zero surviving ideas"));

        return {
          currentAgent: "market_check",
          marketValidation: [],
          deliberationLog: log,
        };
      }

      const marketEvidence: Array<{
        ideaId: string;
        query: string;
        title: string;
        url: string;
        content: string;
      }> = [];

      for (const idea of survivingIdeas) {
        const demandQuery = `${idea.title} market demand user complaints pricing`;
        const competitorQuery = `${idea.title} competitors alternatives pricing comparison`;

        for (const query of [demandQuery, competitorQuery]) {
          emit({
            event: "agent_thinking",
            data: {
              agent: "market_check",
              thought: `Searching market evidence: ${query}`,
            },
          });

          try {
            const results = await searchTavily(query);
            for (const row of results) {
              marketEvidence.push({
                ideaId: idea.id,
                query,
                title: row.title,
                url: row.url,
                content: row.content,
              });
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : "Market search failed";
            emit({
              event: "agent_error",
              data: {
                agent: "market_check",
                error: message,
              },
            });
            log.push(makeLog("market_check", "warning", "Market search failed", { query, message }));
          }
        }
      }

      const validated = await invokeJsonModel<{ marketValidation: MarketValidation[] }>({
        messages: [
          new SystemMessage(marketSystemPrompt),
          new HumanMessage(
            buildMarketUserPrompt({
              ideas: survivingIdeas,
              marketEvidence,
            })
          ),
        ],
        fallback: {
          marketValidation: survivingIdeas.map((idea) => ({
            ideaId: idea.id,
            demandSignals: [
              "Active discussion in community forums",
              "Users comparing multiple alternatives",
            ],
            competitors: [
              {
                name: "Incumbent workflow suite",
                pricing: "$20-$99 / month",
                positioning: "Broad all-in-one platform",
              },
            ],
            trend: "stable" as const,
            evidence: marketEvidence
              .filter((row) => row.ideaId === idea.id)
              .slice(0, 3)
              .map((row) => ({
                label: row.title,
                url: row.url,
                note: row.query,
              })),
            score: 60,
          })),
        },
      });

      const marketValidation = sanitizeMarketValidation(
        validated.data.marketValidation || [],
        survivingIdeas
      );

      emit({
        event: "agent_complete",
        data: {
          agent: "market_check",
          result: {
            validatedIdeas: marketValidation.length,
          },
        },
      });

      log.push(
        makeLog("market_check", "info", "Market Check completed", {
          validatedIdeas: marketValidation.length,
          usedFallback: validated.usedFallback,
          llmError: validated.error,
        })
      );

      return {
        currentAgent: "market_check",
        marketValidation,
        deliberationLog: log,
      };
    })
    .addNode("tech_review", async (state: ForgeGraphState): Promise<Partial<ForgeGraphState>> => {
      emit({
        event: "agent_start",
        data: {
          agent: "tech_review",
          message: "Evaluating technical feasibility...",
        },
      });

      const log = [...state.deliberationLog];
      const survivingIdeas = survivingIdeasFromState(state);

      if (survivingIdeas.length === 0) {
        emit({
          event: "agent_thinking",
          data: {
            agent: "tech_review",
            thought: "No surviving ideas to assess. Skipping technical review.",
          },
        });

        log.push(makeLog("tech_review", "warning", "Skipped due to zero surviving ideas"));

        return {
          currentAgent: "tech_review",
          techAssessment: [],
          deliberationLog: log,
        };
      }

      const assessed = await invokeJsonModel<{ techAssessment: TechAssessment[] }>({
        messages: [
          new SystemMessage(techSystemPrompt),
          new HumanMessage(
            buildTechUserPrompt({
              skills: state.skills,
              ideas: survivingIdeas,
              marketValidation: state.marketValidation,
              preferences: state.preferences,
            })
          ),
        ],
        fallback: {
          techAssessment: survivingIdeas.map((idea) => ({
            ideaId: idea.id,
            feasibilityScore: clampScore(idea.confidenceScore, 62),
            suggestedTechStack: idea.suggestedTechStack,
            mvpTimeline: state.preferences.timeline || "2-4 weeks",
            keyMilestones: [
              "Model data schema and core entities",
              "Build core workflow with auth",
              "Ship private beta and gather feedback",
            ],
            hardestChallenge: "Maintaining product quality while shipping quickly",
            skillFit: `Strong fit with listed skills: ${state.skills.join(", ")}`,
          })),
        },
      });

      const techAssessment = sanitizeTechAssessment(assessed.data.techAssessment || [], survivingIdeas);

      emit({
        event: "agent_complete",
        data: {
          agent: "tech_review",
          result: {
            assessedIdeas: techAssessment.length,
          },
        },
      });

      log.push(
        makeLog("tech_review", "info", "Tech Review completed", {
          assessedIdeas: techAssessment.length,
          usedFallback: assessed.usedFallback,
          llmError: assessed.error,
        })
      );

      return {
        currentAgent: "tech_review",
        techAssessment,
        deliberationLog: log,
      };
    })
    .addNode("synthesizer", async (state: ForgeGraphState): Promise<Partial<ForgeGraphState>> => {
      emit({
        event: "agent_start",
        data: {
          agent: "synthesizer",
          message: "Producing final refined ideas...",
        },
      });

      const log = [...state.deliberationLog];
      const survivingIdeas = survivingIdeasFromState(state);

      if (survivingIdeas.length === 0) {
        const fallback = sortFinalIdeas(
          fallbackFinalIdeas(state.ideas.slice(0, 3), state.marketValidation, state.techAssessment)
        );

        emit({
          event: "agent_complete",
          data: {
            agent: "synthesizer",
            result: {
              finalIdeaCount: fallback.length,
            },
          },
        });

        log.push(
          makeLog("synthesizer", "warning", "No surviving ideas, synthesized from best-effort set")
        );

        return {
          currentAgent: "synthesizer",
          finalIdeas: fallback,
          deliberationLog: log,
        };
      }

      const synthesized = await invokeJsonModel<{ finalIdeas: FinalIdea[] }>({
        messages: [
          new SystemMessage(synthSystemPrompt),
          new HumanMessage(
            buildSynthUserPrompt({
              state,
              survivingIdeas,
              critiques: state.critiques,
              marketValidation: state.marketValidation,
              techAssessment: state.techAssessment,
            })
          ),
        ],
        fallback: {
          finalIdeas: fallbackFinalIdeas(
            survivingIdeas,
            state.marketValidation,
            state.techAssessment
          ),
        },
      });

      const finalIdeas = sortFinalIdeas(
        (synthesized.data.finalIdeas || []).map((idea) => ({
          ...idea,
          confidenceScore: clampScore(idea.confidenceScore, 65),
        }))
      ).slice(0, 3);

      emit({
        event: "agent_complete",
        data: {
          agent: "synthesizer",
          result: {
            finalIdeaCount: finalIdeas.length,
          },
        },
      });

      log.push(
        makeLog("synthesizer", "info", "Synthesizer completed", {
          finalIdeaCount: finalIdeas.length,
          usedFallback: synthesized.usedFallback,
          llmError: synthesized.error,
        })
      );

      return {
        currentAgent: "synthesizer",
        finalIdeas,
        shouldIterate: false,
        feedbackToIdeator: null,
        deliberationLog: log,
      };
    })
    .addEdge(START, "scout")
    .addEdge("scout", "ideator")
    .addEdge("ideator", "critic")
    .addConditionalEdges("critic", (state: ForgeGraphState) =>
      state.shouldIterate ? ["ideator"] : ["market_check", "tech_review"]
    )
    .addEdge("market_check", "synthesizer")
    .addEdge("tech_review", "synthesizer")
    .addEdge("synthesizer", END)
    .compile();

  const initialState = createInitialForgeState(input);

  const finalState = (await graph.invoke(initialState)) as ForgeState;

  emit({
    event: "complete",
    data: {
      ideas: finalState.finalIdeas,
      deliberation_log: finalState.deliberationLog,
    },
  });

  return finalState;
}
