"use client";

import { useState } from "react";
import { Play, FileText, ChevronDown, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewModeProps {
  onStartInterview: (config: any) => void;
  pastSessions: any[];
}

export function InterviewSetup({ onStartInterview, pastSessions }: InterviewModeProps) {
  const [style, setStyle] = useState("General");
  const [difficulty, setDifficulty] = useState("Medium");
  const [topic, setTopic] = useState("Any topic");
  const [source, setSource] = useState("sheet");

  return (
    <div className="max-w-2xl mx-auto pt-16 pb-32 px-6">
      <div className="rounded-xl border border-border bg-card p-10 space-y-10 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Start a Mock Interview</h2>
          <p className="text-sm text-muted-foreground">Practice communicating your thoughts with an AI interviewer.</p>
        </div>

        <div className="h-px bg-border/50 w-full" />

        <div className="space-y-8">
          {/* Company Style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Company style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Google", "Meta", "Amazon", "General"].map(c => (
                <Button 
                  key={c} 
                  variant={style === c ? "default" : "outline"}
                  onClick={() => setStyle(c)}
                  className="w-full"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {["Easy", "Medium", "Hard"].map(d => (
                <Button 
                  key={d} 
                  variant={difficulty === d ? "default" : "outline"}
                  onClick={() => setDifficulty(d)}
                  className="w-full"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Topic focus (optional)</label>
            <div className="relative">
              <select 
                value={topic} 
                onChange={e => setTopic(e.target.value)}
                className="w-full appearance-none bg-background border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50"
              >
                <option>Any topic</option>
                <option>Arrays & Hashing</option>
                <option>Two Pointers</option>
                <option>Trees</option>
                <option>Graphs</option>
                <option>Dynamic Programming</option>
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
                <span className="text-sm flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> AI generates a new one</span>
              </label>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base gap-2"
            onClick={() => onStartInterview({ style, difficulty, topic, source })}
          >
            <Play className="h-4 w-4" /> Start Interview →
          </Button>
        </div>
      </div>

      {pastSessions && pastSessions.length > 0 && (
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Previous sessions</h3>
          <div className="h-px bg-border/50" />
          <div className="space-y-2">
            {pastSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${session.status === 'completed' ? 'bg-primary' : 'border border-muted-foreground'}`} />
                  <span className="text-sm font-medium">{session.company} · {session.difficulty}</span>
                  <span className="text-xs text-muted-foreground">· {session.duration}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{session.problem}</span>
                  {session.score && <span className="text-sm font-mono text-muted-foreground">{session.score}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}