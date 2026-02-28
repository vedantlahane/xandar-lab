// app/lab/practice/components/focus/FocusCard.tsx

"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, Lightbulb, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DifficultyDots } from "../shared/DifficultyDots";
import { CodeBlock } from "../shared/CodeBlock";
import type { DSAProblem } from "../../data/sheet";
import type { TimerHandle } from "../../hooks/useTimer";

interface FocusCardProps {
  problem: DSAProblem;
  timer: TimerHandle;
  /** Called after a successful save so the parent can trigger reflection/navigate. */
  onSolved?: (problemId: string) => void;
  onGaveUp?: (problemId: string) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Medium:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function FocusCard({ problem, timer, onSolved, onGaveUp }: FocusCardProps) {
  const [approach, setApproach] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [complexityTime, setComplexityTime] = useState("");
  const [complexitySpace, setComplexitySpace] = useState("");
  const [difficultyFelt, setDifficultyFelt] = useState(0);
  const [saving, setSaving] = useState(false);

  // Auto-start timer when a problem is loaded
  useEffect(() => {
    timer.reset();
    timer.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  const difficultyTag = problem.tags?.find((t) =>
    ["Easy", "Medium", "Hard"].includes(t),
  );
  const otherTags = problem.tags?.filter(
    (t) => !["Easy", "Medium", "Hard"].includes(t),
  );

  const createAttempt = async (status: "resolved" | "gave_up") => {
    setSaving(true);
    try {
      await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          content: approach,
          code: code || undefined,
          language: code ? language : undefined,
          timeComplexity: complexityTime || undefined,
          spaceComplexity: complexitySpace || undefined,
          feltDifficulty: difficultyFelt || undefined,
          duration: timer.seconds,
          status,
        }),
      });
    } catch (err) {
      console.error("Failed to save attempt:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSolved = async () => {
    timer.pause();
    await createAttempt("resolved");
    onSolved?.(problem.id);
  };

  const handleGaveUp = async () => {
    timer.pause();
    await createAttempt("gave_up");
    onGaveUp?.(problem.id);
  };

  return (
    <div className="h-full flex items-start justify-center overflow-y-auto thin-scrollbar py-8 px-6">
      <div className="w-full max-w-3xl">
        <div className="border border-border/40 rounded-xl bg-card shadow-sm p-8 space-y-6">

          {/* Problem header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{problem.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded bg-muted border border-border/50 text-muted-foreground/80">
                {problem.platform}
              </span>
              {difficultyTag && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border",
                    DIFFICULTY_COLORS[difficultyTag] ??
                      "bg-muted/30 text-muted-foreground",
                  )}
                >
                  {difficultyTag}
                </span>
              )}
              {otherTags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded border bg-muted/30 text-muted-foreground border-transparent"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Description */}
          {problem.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {problem.description}
            </p>
          )}

          <div className="h-px bg-border/40" />

          {/* Approach */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your approach
            </label>
            <textarea
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Describe your thinking before or while solving..."
              className={cn(
                "w-full h-24 resize-none",
                "rounded-lg border border-border/40 bg-background",
                "px-4 py-3 text-sm leading-relaxed",
                "placeholder:text-muted-foreground/40",
                "focus:outline-none focus:ring-1 focus:ring-ring/20",
              )}
            />
          </div>

          {/* Code */}
          <CodeBlock
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
          />

          {/* Complexity + Felt difficulty */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Time:</label>
              <input
                value={complexityTime}
                onChange={(e) => setComplexityTime(e.target.value)}
                placeholder="O(?)"
                className={cn(
                  "w-24 text-xs font-mono",
                  "border border-border/40 rounded px-2 py-1.5",
                  "bg-transparent placeholder:text-muted-foreground/40",
                  "focus:outline-none focus:ring-1 focus:ring-ring/20",
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Space:</label>
              <input
                value={complexitySpace}
                onChange={(e) => setComplexitySpace(e.target.value)}
                placeholder="O(?)"
                className={cn(
                  "w-24 text-xs font-mono",
                  "border border-border/40 rounded px-2 py-1.5",
                  "bg-transparent placeholder:text-muted-foreground/40",
                  "focus:outline-none focus:ring-1 focus:ring-ring/20",
                )}
              />
            </div>
            <DifficultyDots value={difficultyFelt} onChange={setDifficultyFelt} />
          </div>

          <div className="h-px bg-border/40" />

          {/* Action bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" className="gap-2" asChild>
              <a href={problem.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={15} />
                Open {problem.platform}
              </a>
            </Button>

            <Button variant="outline" size="sm" className="gap-1.5">
              <Lightbulb size={14} />
              Hint
            </Button>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleGaveUp}
              disabled={saving}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <Flag size={14} />
              Quit
            </Button>

            <Button
              onClick={handleSolved}
              disabled={saving}
              className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              <Check size={15} />
              Mark Solved
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
