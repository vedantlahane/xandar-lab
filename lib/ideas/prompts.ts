import type {
  Critique,
  ForgeState,
  Idea,
  MarketValidation,
  Signal,
  TechAssessment,
} from "@/lib/ideas/types";

const JSON_RULES = `Return only valid JSON. Do not include markdown fences, prose, or extra keys.`;

export const scoutSystemPrompt = `You are Scout, a market signal investigator.
Your job is to filter noisy web search findings into credible pain signals.
${JSON_RULES}`;

export function buildScoutUserPrompt(args: {
  domain: string;
  skills: string[];
  rawFindings: Array<{
    query: string;
    title: string;
    url: string;
    content: string;
  }>;
}) {
  return `Domain: ${args.domain}
Skills: ${args.skills.join(", ")}

Raw findings:
${JSON.stringify(args.rawFindings, null, 2)}

Output JSON with shape:
{
  "signals": [
    {
      "summary": "string",
      "painPoint": "string",
      "sourceUrl": "string",
      "sourceTitle": "string",
      "evidenceSnippet": "string",
      "confidence": 0-100
    }
  ]
}

Rules:
- Keep only signals with real user pain.
- Remove duplicated or weak claims.
- Keep between 6 and 12 signals.
- Confidence must reflect evidence quality.`;
}

export const ideatorSystemPrompt = `You are Ideator, a creative product strategist.
Generate original project ideas by connecting multiple signals.
Avoid generic "AI app" outputs and avoid repeating obvious incumbents.
${JSON_RULES}`;

export function buildIdeatorUserPrompt(args: {
  state: ForgeState;
  feedback: string | null;
}) {
  return `Domain: ${args.state.domain}
Skills: ${args.state.skills.join(", ")}
Preferences: ${JSON.stringify(args.state.preferences)}
Iteration: ${args.state.iterationCount}
Critic feedback from previous round: ${args.feedback ?? "none"}
Signals:
${JSON.stringify(args.state.signals, null, 2)}

Output JSON with shape:
{
  "ideas": [
    {
      "id": "string",
      "title": "string",
      "problem": "string",
      "solution": "string",
      "targetUser": "string",
      "whyYou": "string",
      "confidenceScore": 0-100,
      "suggestedTechStack": ["string"]
    }
  ]
}

Rules:
- Return exactly 5 ideas.
- Each idea must be clearly distinct.
- If feedback exists, produce different ideas that address it.
- Match stack recommendations to user skills.`;
}

export const criticSystemPrompt = `You are Critic, a ruthless devil's advocate.
Stress-test each idea and identify fatal weaknesses.
You must be specific and realistic.
${JSON_RULES}`;

export function buildCriticUserPrompt(ideas: Idea[], signals: Signal[]) {
  return `Ideas:
${JSON.stringify(ideas, null, 2)}

Signals:
${JSON.stringify(signals, null, 2)}

Output JSON with shape:
{
  "critiques": [
    {
      "ideaId": "string",
      "verdict": "KILL|REVISE|PROCEED",
      "competitors": ["string"],
      "fatalFlaws": ["string"],
      "feedback": "string"
    }
  ]
}

Rules:
- Name likely incumbents where possible.
- If market is too weak, say KILL.
- If salvageable, say REVISE with actionable direction.
- Use PROCEED only when there is clear room to win.`;
}

export const marketSystemPrompt = `You are Market Check, a practical market analyst.
Validate demand, competitive pressure, and trend quality.
${JSON_RULES}`;

export function buildMarketUserPrompt(args: {
  ideas: Idea[];
  marketEvidence: Array<{
    ideaId: string;
    query: string;
    title: string;
    url: string;
    content: string;
  }>;
}) {
  return `Ideas:
${JSON.stringify(args.ideas, null, 2)}

Market evidence:
${JSON.stringify(args.marketEvidence, null, 2)}

Output JSON with shape:
{
  "marketValidation": [
    {
      "ideaId": "string",
      "demandSignals": ["string"],
      "competitors": [{"name":"string", "pricing":"string", "positioning":"string"}],
      "trend": "growing|stable|shrinking",
      "evidence": [{"label":"string", "url":"string", "note":"string"}],
      "score": 0-100
    }
  ]
}

Rules:
- Provide at least 2 evidence links per idea when available.
- Keep score realistic; avoid inflated scoring.`;
}

export const techSystemPrompt = `You are Tech Review, a principal engineer.
Evaluate feasibility, MVP scope, and execution risk.
${JSON_RULES}`;

export function buildTechUserPrompt(args: {
  skills: string[];
  ideas: Idea[];
  marketValidation: MarketValidation[];
  preferences: ForgeState["preferences"];
}) {
  return `Skills: ${args.skills.join(", ")}
Preferences: ${JSON.stringify(args.preferences)}
Ideas:
${JSON.stringify(args.ideas, null, 2)}
Market validation:
${JSON.stringify(args.marketValidation, null, 2)}

Output JSON with shape:
{
  "techAssessment": [
    {
      "ideaId": "string",
      "feasibilityScore": 0-100,
      "suggestedTechStack": ["string"],
      "mvpTimeline": "string",
      "keyMilestones": ["string"],
      "hardestChallenge": "string",
      "skillFit": "string"
    }
  ]
}

Rules:
- Favor stack choices the builder can realistically ship.
- Keep milestone list concise and action-oriented.`;
}

export const synthSystemPrompt = `You are Synthesizer, an experienced product partner.
Produce polished, actionable final briefs using all prior analysis.
${JSON_RULES}`;

export function buildSynthUserPrompt(args: {
  state: ForgeState;
  survivingIdeas: Idea[];
  critiques: Critique[];
  marketValidation: MarketValidation[];
  techAssessment: TechAssessment[];
}) {
  return `Domain: ${args.state.domain}
Skills: ${args.state.skills.join(", ")}
Preferences: ${JSON.stringify(args.state.preferences)}
Signals:
${JSON.stringify(args.state.signals, null, 2)}
Surviving ideas:
${JSON.stringify(args.survivingIdeas, null, 2)}
Critiques:
${JSON.stringify(args.critiques, null, 2)}
Market validation:
${JSON.stringify(args.marketValidation, null, 2)}
Tech assessment:
${JSON.stringify(args.techAssessment, null, 2)}

Output JSON with shape:
{
  "finalIdeas": [
    {
      "id": "string",
      "confidenceScore": 0-100,
      "title": "string",
      "problem": "string",
      "solution": "string",
      "targetUser": "string",
      "whyYou": "string",
      "suggestedTechStack": ["string"],
      "mvpScope": {
        "timeline": "string",
        "keyMilestones": ["string"]
      },
      "monetization": "string",
      "risks": ["string"],
      "evidence": [{"label":"string", "url":"string", "note":"string"}],
      "summary": "string"
    }
  ]
}

Rules:
- Return between 1 and 3 final ideas.
- Rank by confidenceScore descending.
- Confidence must consider critic, market, and technical constraints.`;
}
