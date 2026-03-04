// app/lab/practice/components/interview/InterviewSetup.tsx

"use client";

import { useState } from "react";
import { Play, ChevronDown, Zap, BookOpen, Swords, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InterviewConfig, InterviewStyle, PastSession } from "./InterviewManager";
import { SHEET } from "../../data/sheet";
import { cn } from "@/lib/utils";

// ── Style cards ─────────────────────────────────────────────────────────────

const STYLE_OPTIONS: {
  value: InterviewStyle;
  label: string;
  description: string;
  icon: typeof BookOpen;
  hintBudget: number;
}[] = [
    {
      value: "guided",
      label: "Guided",
      description: "Patient, educational. Lots of hints. For learning.",
      icon: BookOpen,
      hintBudget: 5,
    },
    {
      value: "realistic",
      label: "Realistic",
      description: "Like a real FAANG interview. Balanced help.",
      icon: Swords,
      hintBudget: 3,
    },
    {
      value: "pressure",
      label: "Pressure Test",
      description: "Tough interviewer. Interruptions. Time pressure.",
      icon: Flame,
      hintBudget: 1,
    },
  ];

const TOPIC_OPTIONS = [
  "Any topic",
  ...SHEET.map((t) => t.topicName),
];

// ── Component ──────────────────────────────────────────────────────────────

interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
  pastSessions: PastSession[];
}

export function InterviewSetup({
  onStartInterview,
  pastSessions,
}: InterviewSetupProps) {
  const [style, setStyle] = useState<InterviewStyle>("realistic");
  const [difficultyMode, setDifficultyMode] = useState<"auto" | "manual">("auto");
  const [manualDifficulty, setManualDifficulty] = useState(3);
  const [topic, setTopic] = useState("Any topic");
  const [source, setSource] = useState<"sheet" | "ai">("sheet");

  const selectedStyle = STYLE_OPTIONS.find((s) => s.value === style)!;

  return (
    <div className="max-w-2xl mx-auto pt-16 pb-32 px-6">
      <div className="rounded-xl border border-white/40 dark:border-white/5 bg-linear-to-br from-white/60 to-white/30 dark:from-zinc-900/40 dark:to-zinc-900/10 backdrop-blur-md shadow-xl shadow-black/5 p-10 space-y-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Start a Mock Interview
          </h2>
          <p className="text-sm text-muted-foreground">
            Practice communicating your thoughts with an AI interviewer.
          </p>
        </div>

        <div className="h-px bg-border/50 w-full" />

        <div className="space-y-8">
          {/* Interview Style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Interview style</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {STYLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = style === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStyle(opt.value)}
                    className={cn(
                      "relative p-4 rounded-xl border text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/50 hover:border-border hover:bg-muted/20",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-semibold", isActive && "text-primary")}>{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                    <div className="mt-2 text-[10px] text-muted-foreground/70">
                      {opt.hintBudget} hint{opt.hintBudget !== 1 ? "s" : ""} available
                    </div>
                    {isActive && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Difficulty</label>
            <div className="flex gap-3 mb-3">
              <Button
                variant={difficultyMode === "auto" ? "default" : "outline"}
                onClick={() => setDifficultyMode("auto")}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto ★
              </Button>
              <Button
                variant={difficultyMode === "manual" ? "default" : "outline"}
                onClick={() => setDifficultyMode("manual")}
              >
                Manual
              </Button>
            </div>

            {difficultyMode === "auto" ? (
              <p className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/30">
                Auto difficulty uses your past interview performance to find your growth edge.
                First-time users start at Level 2 (Medium-Easy).
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={manualDifficulty}
                    onChange={(e) => setManualDifficulty(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-mono w-8 text-center">{manualDifficulty}/5</span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                </div>
              </div>
            )}
          </div>

          {/* Topic */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">
              Topic focus (optional)
            </label>
            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full appearance-none bg-background border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              >
                {TOPIC_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Problem</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  checked={source === "sheet"}
                  onChange={() => setSource("sheet")}
                  className="accent-primary"
                />
                <span className="text-sm">Pick from my sheet</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  checked={source === "ai"}
                  onChange={() => setSource("ai")}
                  className="accent-primary"
                />
                <span className="text-sm flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" /> AI generates a
                  new one
                </span>
              </label>
            </div>
          </div>

          <Button
            className="w-full h-12 text-base gap-2"
            onClick={() =>
              onStartInterview({
                style,
                difficulty: difficultyMode === "auto" ? "auto" : manualDifficulty,
                topic,
                source,
              })
            }
          >
            <Play className="h-4 w-4" /> Start Interview →
          </Button>
        </div>
      </div>

      {pastSessions.length > 0 && (
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Previous sessions
          </h3>
          <div className="h-px bg-border/50" />
          <div className="space-y-2">
            {pastSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${session.status === "completed"
                      ? "bg-primary"
                      : "border border-muted-foreground"
                      }`}
                  />
                  <span className="text-sm font-medium capitalize">
                    {session.style} · Lv.{session.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {session.duration}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{session.topic}</span>
                  {session.score && (
                    <span className="text-sm font-mono text-muted-foreground">
                      {session.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
