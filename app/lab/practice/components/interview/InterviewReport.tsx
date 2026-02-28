"use client";

import { motion } from "framer-motion";
import { Check, X, AlertCircle, ArrowRight, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewReportProps {
  onClose: () => void;
}

export function InterviewReport({ onClose }: InterviewReportProps) {
  // Mock performance data
  const overallScore = 7.5;
  const metrics = [
    { name: "Communication", score: 8, max: 10, fill: "████████░░" },
    { name: "Problem Solving", score: 7, max: 10, fill: "███████░░░" },
    { name: "Code Quality", score: 9, max: 10, fill: "█████████░" },
    { name: "Speed", score: 6, max: 10, fill: "██████░░░░" },
  ];

  const feedback = [
    { type: "strength", text: "Excellent job breaking down the problem into smaller, testable chunks." },
    { type: "strength", text: "You proactively identified edge cases before writing code." },
    { type: "improvement", text: "Consider discussing space complexity earlier in the Approach phase." },
    { type: "improvement", text: "You took a bit long on syntax errors during the dry run." },
  ];

  return (
    <div className="h-full overflow-y-auto w-full max-w-4xl mx-auto p-8 relative thin-scrollbar">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-8 right-8 text-muted-foreground hover:bg-muted/50 rounded-full"
      >
        <X className="h-5 w-5" />
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Session Complete</h1>
        <p className="text-muted-foreground">Mock Interview · Meta Style · Medium</p>

        {/* Overall Score Banner */}
        <div className="mt-8 p-6 bg-secondary/50 rounded-xl border border-secondary flex flex-wrap gap-8 items-center justify-between shadow-sm">
          <div>
            <h3 className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-1">Overall Assessment</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold tabular-nums tracking-tighter">{overallScore}</span>
              <span className="text-xl text-muted-foreground">/ 10</span>
              <div className="ml-4 px-3 py-1 bg-green-500/10 text-green-500 rounded-md text-sm font-medium border border-green-500/20">
                Strong Hire
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm">
              {metrics.map((m) => (
                <div key={m.name} className="flex justify-between items-center group">
                  <span className="text-muted-foreground">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground tracking-[0.1em] text-xs">{m.fill}</span>
                    <span className="w-8 text-right font-medium">{m.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" /> Strengths
            </h3>
            <ul className="space-y-3">
              {feedback.filter(f => f.type === "strength").map((f, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                  <div className="mt-0.5">•</div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Areas to Improve
            </h3>
            <ul className="space-y-3">
              {feedback.filter(f => f.type === "improvement").map((f, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                  <div className="mt-0.5">•</div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 mb-16 space-y-4">
          <h3 className="text-lg font-semibold border-b border-border/40 pb-2">Follow-up Practice</h3>
          <p className="text-sm text-muted-foreground">Based on this session, you should focus on interval merging and space optimization.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                 <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Merge Intervals</h4>
                 <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full font-medium">Medium</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Practice handling overlapping bounds without extra space.</p>
              <Button variant="secondary" size="sm" className="w-full text-xs h-7">Solve <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                 <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Insert Interval</h4>
                 <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full font-medium">Medium</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Focus on clean single-pass implementations.</p>
              <Button variant="secondary" size="sm" className="w-full text-xs h-7">Solve <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-16">
           <Button onClick={onClose} size="lg" className="rounded-full px-8 gap-2 shadow-md hover:shadow-lg transition-all">
             <BarChart2 className="h-4 w-4" /> View Full Analytics
           </Button>
        </div>

      </motion.div>
    </div>
  );
}