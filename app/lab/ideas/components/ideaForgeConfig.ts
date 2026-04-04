import type { AgentName } from "@/lib/ideas/types";

export const DOMAIN_OPTIONS = [
  "Developer Tools",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AI/ML Tools",
  "DevOps",
  "E-Commerce",
  "Productivity",
  "SaaS",
  "Open Source",
] as const;

export const SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Docker",
  "AWS",
  "PostgreSQL",
  "MongoDB",
  "LangGraph",
  "LangChain",
  "Tavily",
  "Redis",
  "Supabase",
  "FastAPI",
];

export type StageStatus = "pending" | "active" | "complete" | "error";

export type StageView = {
  id: AgentName;
  label: string;
  description: string;
};

export const STAGES: StageView[] = [
  {
    id: "scout",
    label: "Scout",
    description: "Scanning the internet for signals...",
  },
  {
    id: "ideator",
    label: "Ideator",
    description: "Brainstorming original ideas...",
  },
  {
    id: "critic",
    label: "Critic",
    description: "Challenging every idea ruthlessly...",
  },
  {
    id: "market_check",
    label: "Market Check",
    description: "Validating market demand...",
  },
  {
    id: "tech_review",
    label: "Tech Review",
    description: "Evaluating technical feasibility...",
  },
  {
    id: "synthesizer",
    label: "Synthesizer",
    description: "Producing final refined ideas...",
  },
];
