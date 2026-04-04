export type AgentName =
  | "scout"
  | "ideator"
  | "critic"
  | "market_check"
  | "tech_review"
  | "synthesizer";

export type CriticVerdict = "KILL" | "REVISE" | "PROCEED";

export interface UserPreferences {
  timeline?: "1 week" | "2-4 weeks" | "1-2 months";
  goal?: "learn_portfolio" | "side_project" | "potential_startup";
  monetization?: "not_important" | "nice_to_have" | "primary_goal";
}

export interface Signal {
  summary: string;
  painPoint: string;
  sourceUrl: string;
  sourceTitle?: string;
  evidenceSnippet?: string;
  confidence: number;
}

export interface Idea {
  id: string;
  title: string;
  problem: string;
  solution: string;
  targetUser: string;
  whyYou: string;
  confidenceScore: number;
  suggestedTechStack: string[];
}

export interface Critique {
  ideaId: string;
  verdict: CriticVerdict;
  competitors: string[];
  fatalFlaws: string[];
  feedback: string;
}

export interface EvidenceLink {
  label: string;
  url: string;
  note?: string;
}

export interface MarketValidation {
  ideaId: string;
  demandSignals: string[];
  competitors: Array<{
    name: string;
    pricing: string;
    positioning: string;
  }>;
  trend: "growing" | "stable" | "shrinking";
  evidence: EvidenceLink[];
  score: number;
}

export interface TechAssessment {
  ideaId: string;
  feasibilityScore: number;
  suggestedTechStack: string[];
  mvpTimeline: string;
  keyMilestones: string[];
  hardestChallenge: string;
  skillFit: string;
}

export interface FinalIdea {
  id: string;
  confidenceScore: number;
  title: string;
  problem: string;
  solution: string;
  targetUser: string;
  whyYou: string;
  suggestedTechStack: string[];
  mvpScope: {
    timeline: string;
    keyMilestones: string[];
  };
  monetization: string;
  risks: string[];
  evidence: EvidenceLink[];
  summary: string;
}

export interface LogEntry {
  timestamp: string;
  agent: AgentName | "system";
  level: "info" | "warning" | "error";
  message: string;
  details?: unknown;
}

export interface ForgeInput {
  domain: string;
  skills: string[];
  preferences?: UserPreferences;
}

export interface ForgeState {
  domain: string;
  skills: string[];
  preferences: UserPreferences;

  signals: Signal[];
  ideas: Idea[];
  critiques: Critique[];
  marketValidation: MarketValidation[];
  techAssessment: TechAssessment[];
  finalIdeas: FinalIdea[];

  currentAgent: AgentName | "idle";
  iterationCount: number;
  maxIterations: number;
  feedbackToIdeator: string | null;
  shouldIterate: boolean;

  deliberationLog: LogEntry[];
}

export type ForgeStreamEventType =
  | "agent_start"
  | "agent_thinking"
  | "agent_complete"
  | "agent_error"
  | "iteration"
  | "complete";

export interface ForgeStreamEvent {
  event: ForgeStreamEventType;
  data: Record<string, unknown>;
}

export const PIPELINE_STAGE_ORDER: AgentName[] = [
  "scout",
  "ideator",
  "critic",
  "market_check",
  "tech_review",
  "synthesizer",
];
