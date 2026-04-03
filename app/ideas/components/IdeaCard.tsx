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
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FinalIdea } from "@/lib/ideaforge/types";

type IdeaCardProps = {
  idea: FinalIdea;
  rank: number;
};

function confidenceTone(score: number) {
  if (score >= 80) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }

  if (score >= 60) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }

  return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
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
    <div className={cn(
      "w-full rounded-xl border border-white/40 dark:border-white/5 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-200 overflow-hidden",
      expanded ? "ring-1 ring-primary/20" : "hover:border-border/80"
    )}>
      {/* Header Area */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-5 mb-4">
          <div className="flex-shrink-0">
             <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primary/10 shadow-inner">
               <Lightbulb className="h-6 w-6 text-primary" />
             </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest bg-muted/40 px-2 py-0.5 rounded-md">
                Rank #{rank}
              </span>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap", badgeTone)}>
                Confidence {idea.confidenceScore}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
              {idea.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {idea.summary}
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 md:pl-[68px]">
          <Button size="sm" variant="outline" onClick={copyMarkdown} className="h-8 text-xs px-3 border-border/50">
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Failed"
                : "Copy Markdown"}
          </Button>

          <Button size="sm" asChild className="h-8 text-xs px-3 shadow-sm bg-primary/90 hover:bg-primary">
            <a href="/lab/experiments" aria-label="Start building this idea">
              <Rocket className="h-3.5 w-3.5 mr-1.5" />
              Build It
            </a>
          </Button>

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setExpanded((v) => !v)}
            className="h-8 text-xs px-3 ml-auto text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Hide Details" : "View Details"}
            {expanded ? <ChevronUp className="h-3.5 w-3.5 ml-1.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-1.5" />}
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 pt-0 border-t border-border/30 bg-muted/5 mt-2">
          <div className="space-y-6 pt-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">The Problem</h4>
                <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded-lg border border-border/30">{idea.problem}</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">The Solution</h4>
                <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded-lg border border-border/30">{idea.solution}</p>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">Target User</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{idea.targetUser}</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">Why You?</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{idea.whyYou}</p>
              </section>
            </div>

            <Separator className="border-border/30" />

            <section className="space-y-3">
              <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">Suggested Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {idea.suggestedTechStack.map((item) => (
                  <span key={item} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-md border border-border/50">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center justify-between">
                <span>MVP Scope</span>
                <span className="lowercase normal-case font-normal">{idea.mvpScope.timeline}</span>
              </h4>
              <ul className="space-y-2 text-sm text-foreground/80">
                {idea.mvpScope.keyMilestones.map((milestone, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                  Risks & Hurdles
                </h4>
                <ul className="space-y-1.5 text-sm text-foreground/70">
                  {idea.risks.map((risk, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-red-500/70 select-none">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </section>
              
              <section className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">Monetization</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{idea.monetization}</p>
              </section>
            </div>

            {/* Evidence Section */}
            <section className="space-y-3 mt-4">
              <button
                type="button"
                className="flex w-full items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                onClick={() => setEvidenceOpen(!evidenceOpen)}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold tracking-tight text-foreground">View Compiled Evidence</span>
                </div>
                {evidenceOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {evidenceOpen && (
                <div className="space-y-2 bg-background/40 p-3 rounded-lg border border-border/30">
                  {idea.evidence.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No evidence links were attached by the Scout agent.</p>
                  ) : (
                    idea.evidence.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 rounded-md border border-border/50 bg-card hover:bg-muted/30 transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{item.label}</div>
                          {item.note && <div className="text-xs text-muted-foreground truncate mt-0.5">{item.note}</div>}
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      </a>
                    ))
                  )}
                </div>
              )}
            </section>
            
          </div>
        </div>
      )}
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}
