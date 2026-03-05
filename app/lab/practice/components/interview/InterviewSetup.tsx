// app/lab/practice/components/interview/InterviewSetup.tsx

"use client";

import { useState } from "react";
import { Play, ChevronDown, Zap, BookOpen, Swords, Flame, Sparkles, Clock, Trophy, ArrowRight } from "lucide-react";
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
  color: string;
}[] = [
    {
      value: "guided",
      label: "Guided",
      description: "Patient, educational. Lots of hints. For learning.",
      icon: BookOpen,
      hintBudget: 5,
      color: "text-blue-500",
    },
    {
      value: "realistic",
      label: "Realistic",
      description: "Like a real FAANG interview. Balanced help.",
      icon: Swords,
      hintBudget: 3,
      color: "text-primary",
    },
    {
      value: "pressure",
      label: "Pressure Test",
      description: "Tough interviewer. Interruptions. Time pressure.",
      icon: Flame,
      hintBudget: 1,
      color: "text-red-500",
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
            <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
              Interview Style
            </label>
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
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center",
                        isActive ? "bg-primary/10" : "bg-muted/50",
                      )}>
                        <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <span className={cn("text-sm font-semibold", isActive && "text-primary")}>{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                    <div className="mt-2.5 text-[10px] text-muted-foreground/70 flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      {opt.hintBudget} hint{opt.hintBudget !== 1 ? "s" : ""} available
                    </div>
                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
              Difficulty
            </label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setDifficultyMode("auto")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                  difficultyMode === "auto"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border/50 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto
              </button>
              <button
                onClick={() => setDifficultyMode("manual")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                  difficultyMode === "manual"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border/50 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                Manual
              </button>
            </div>

            {difficultyMode === "auto" ? (
              <p className="text-xs text-muted-foreground bg-muted/30 px-3 py-2.5 rounded-lg border border-border/30">
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
                  <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Easy</span>
                  <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Medium</span>
                  <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Hard</span>
                </div>
              </div>
            )}
          </div>

          {/* Topic */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
              Topic Focus
            </label>
            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full appearance-none bg-background border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 hover:border-border transition-colors"
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
            <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
              Problem Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSource("sheet")}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all",
                  source === "sheet"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border/50 text-muted-foreground hover:bg-muted/30",
                )}
              >
                Pick from sheet
              </button>
              <button
                onClick={() => setSource("ai")}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all",
                  source === "ai"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    : "border-border/50 text-muted-foreground hover:bg-muted/30",
                )}
              >
                <Zap className="h-3.5 w-3.5" /> AI generates
              </button>
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
          <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-1">
            Previous Sessions
          </h3>
          <div className="h-px bg-border/50" />
          <div className="space-y-2">
            {pastSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 hover:bg-muted/30 hover:border-border/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      session.status === "completed"
                        ? "bg-green-500/10"
                        : "bg-muted/50",
                    )}
                  >
                    {session.status === "completed" ? (
                      <Trophy className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium capitalize">
                      {session.style} · Lv.{session.difficulty}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{session.topic}</span>
                      <span>·</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.score && (
                    <span className="text-sm font-mono text-muted-foreground">
                      {session.score}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
