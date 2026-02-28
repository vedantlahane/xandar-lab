import React, { useState } from "react"
import { FlaskConical, X, Pause, RotateCcw, Check, XCircle, Flag, ChevronRight, Play } from "lucide-react"
import "../style.css"

import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://leetcode.com/problems/*", "https://www.geeksforgeeks.org/problems/*"]
}

type WidgetState = "collapsed" | "expanded" | "post-sync"

export default function PracticeWidget() {
  const [state, setState] = useState<WidgetState>("expanded")
  const [timerStarted, setTimerStarted] = useState(true)

  // Handlers
  const handleSolve = () => setState("post-sync")
  const handleDone = () => setState("collapsed")
  const toggleExpand = () => {
    if (state === "collapsed") setState("expanded")
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased text-zinc-100 dark">
      {/* 10A: Collapsed State */}
      {state === "collapsed" && (
        <button
          onClick={toggleExpand}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/95 border border-zinc-700/50 shadow-lg backdrop-blur-md hover:bg-zinc-800/95 transition-colors cursor-pointer group"
        >
          <FlaskConical className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
          <span className="font-mono text-sm tracking-tight text-zinc-300">
            {timerStarted ? "14:32" : "00:00"}
          </span>
        </button>
      )}

      {/* 10B: Expanded State */}
      {state === "expanded" && (
        <div className="w-[280px] rounded-xl bg-zinc-900/95 border border-zinc-700/50 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FlaskConical className="w-4 h-4" />
              <span>Xandar-Lab</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <button className="hover:text-zinc-100 transition-colors">
                <div className="w-3 h-px bg-current" />
              </button>
              <button onClick={() => setState("collapsed")} className="hover:text-zinc-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Problem Info */}
            <div className="space-y-1">
              <div className="font-medium">Two Sum</div>
              <div className="text-xs text-zinc-400">LeetCode · Easy · Arrays</div>
              <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                <Check className="w-3 h-3" /> Matched to your sheet
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Timer Section */}
            <div className="space-y-3">
              <div className="text-3xl font-mono tracking-tight text-center font-medium">
                00:14:32
              </div>
              <div className="flex items-center justify-center gap-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-medium">
                  {timerStarted ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {timerStarted ? "Pause" : "Resume"}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-medium">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Quick Note */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Quick note:</label>
              <textarea 
                className="w-full h-16 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
                placeholder="Write approach..."
                defaultValue={"Using hash map approach,\ncomplement = target - num"}
              />
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Outcomes */}
            <div className="space-y-2">
              <button 
                onClick={handleSolve}
                className="w-full flex justify-center items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <Check className="w-4 h-4" /> Solved
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleSolve}
                  className="flex justify-center flex-1 items-center gap-1.5 border border-zinc-700 hover:bg-zinc-800/50 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Failed
                </button>
                <button 
                  onClick={handleSolve}
                  className="flex justify-center flex-1 items-center gap-1.5 border border-zinc-700 hover:bg-zinc-800/50 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" /> Gave Up
                </button>
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Auto-detected sub (Tier 2) */}
            <div className="text-xs space-y-1">
              <div className="text-zinc-400">Submissions detected: <span className="text-zinc-200">2</span></div>
              <div className="text-zinc-400 flex items-center justify-between">
                <span>Last verdict: <span className="text-red-400">Wrong Answer</span></span>
                <span className="text-[10px] text-zinc-600">(auto-detected)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10C: Post-Sync State */}
      {state === "post-sync" && (
        <div className="w-[280px] rounded-xl bg-zinc-900/95 border border-zinc-700/50 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FlaskConical className="w-4 h-4" />
              <span>Xandar-Lab</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <button className="hover:text-zinc-100 transition-colors">
                <div className="w-3 h-px bg-current" />
              </button>
              <button onClick={() => setState("collapsed")} className="hover:text-zinc-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 text-sm">
            {/* Success Msg */}
            <div className="flex gap-2 text-green-400 font-medium">
              <Check className="w-4 h-4 shrink-0" />
              <div>
                <div>Synced to Xandar-Lab</div>
                <div className="text-xs text-zinc-300 font-normal mt-1 leading-snug">
                  Two Sum · Solved · 14:32<br/>
                  2 submissions · Quick note saved
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 block">How hard did this feel?</label>
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className="w-8 h-8 rounded border border-zinc-700 hover:bg-zinc-800 flex items-center justify-center font-medium transition-colors focus:bg-zinc-100 focus:text-zinc-900 focus:border-zinc-100">
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider">
                <span>Trivial</span>
                <span>Brutal</span>
              </div>
            </div>

            {/* Code paste */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Paste your code? (optional)</label>
              <textarea 
                className="w-full h-20 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-400 font-mono placeholder:text-zinc-600 resize-none focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                placeholder="(paste from LeetCode editor)"
              />
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleDone}
                className="w-full flex justify-center items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Done — close widget
              </button>
              
              <a href="#" className="flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 transition-colors group">
                Open problem in Xandar-Lab
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}