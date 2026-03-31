"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Rocket,
  ShieldAlert,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinalIdea } from "@/lib/ideaforge/types";

type IdeaCardProps = {
  idea: FinalIdea;
  rank: number;
};

function confidenceTone(score: number) {
  if (score >= 80) {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (score >= 60) {
    return "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300";
}

function toMarkdown(idea: FinalIdea) {
  const evidenceLines = idea.evidence.length
    ? idea.evidence.map((item) => `- [${item.label}](${item.url})${item.note ? ` - ${item.note}` : ""}`).join("\n")
    : "- No external evidence attached";

  return `## ${idea.title}

- Confidence: ${idea.confidenceScore}
- Target User: ${idea.targetUser}
- Why You: ${idea.whyYou}

### Problem
${idea.problem}

### Solution
${idea.solution}

### Suggested Tech Stack
${idea.suggestedTechStack.map((item) => `- ${item}`).join("\n")}

### MVP Scope
- Timeline: ${idea.mvpScope.timeline}
${idea.mvpScope.keyMilestones.map((milestone) => `- ${milestone}`).join("\n")}

### Monetization
${idea.monetization}

### Risks
${idea.risks.map((risk) => `- ${risk}`).join("\n")}

### Evidence
${evidenceLines}
`;
}

export function IdeaCard(props: IdeaCardProps) {
  const { idea, rank } = props;
  const [expanded, setExpanded] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const badgeTone = useMemo(() => confidenceTone(idea.confidenceScore), [idea.confidenceScore]);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(idea));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  };

  return (
    <Card className="border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-950/40">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className={`border ${badgeTone}`}>Confidence {idea.confidenceScore}</Badge>
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Rank #{rank}
          </span>
        </div>

        <div className="space-y-2">
          <CardTitle className="text-xl leading-tight text-zinc-900 dark:text-zinc-100">{idea.title}</CardTitle>
          <CardDescription>{idea.summary}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={copyMarkdown}>
            <Copy className="h-3.5 w-3.5" />
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy as Markdown"}
          </Button>

          <Button size="sm" variant="default" asChild>
            <a href="/lab/experiments" className="inline-flex items-center" aria-label="Start building this idea">
              <Rocket className="h-3.5 w-3.5" />
              Start Building
            </a>
          </Button>

          <Button size="sm" variant="ghost" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>

      {expanded ? (
        <CardContent className="space-y-4">
          <section className="space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Problem</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{idea.problem}</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Solution</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{idea.solution}</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Target User</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{idea.targetUser}</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Why You</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{idea.whyYou}</p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Suggested Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {idea.suggestedTechStack.map((item) => (
                <Badge key={`${idea.id}-${item}`} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">MVP Scope</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Timeline: {idea.mvpScope.timeline}</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
              {idea.mvpScope.keyMilestones.map((milestone) => (
                <li key={`${idea.id}-${milestone}`}>{milestone}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Monetization</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{idea.monetization}</p>
          </section>

          <section className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Risks
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
              {idea.risks.map((risk) => (
                <li key={`${idea.id}-${risk}`}>{risk}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2 rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              onClick={() => setEvidenceOpen((value) => !value)}
            >
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-4 w-4 text-teal-500" />
                Evidence
              </span>
              {evidenceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {evidenceOpen ? (
              <div className="space-y-2">
                {idea.evidence.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">No evidence links were attached.</p>
                ) : (
                  idea.evidence.map((item) => (
                    <a
                      key={`${idea.id}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start justify-between gap-2 rounded-md border border-zinc-200/70 bg-white px-2 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{item.label}</span>
                        {item.note ? <span className="text-zinc-500 dark:text-zinc-400">{item.note}</span> : null}
                      </span>
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    </a>
                  ))
                )}
              </div>
            ) : null}
          </section>
        </CardContent>
      ) : null}
    </Card>
  );
}
