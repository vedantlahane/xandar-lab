"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------
// Reusable Roadmap Filter UI
// ----------------------------------------------------

export interface TrackFilterProps {
  id: string;
  label: string;
  sub: string;
  active: boolean;
  onClick: (id: string) => void;
}

export function RoadmapTrackBox({ id, label, sub, active, onClick }: TrackFilterProps) {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "bg-muted/30 border border-border/50 rounded-lg p-3 text-center cursor-pointer transition-all duration-200 select-none",
        "hover:bg-muted/70 hover:border-border",
        active && "bg-card border-primary/50 shadow-sm ring-1 ring-primary/20"
      )}
    >
      <div className="text-xs font-semibold text-foreground tracking-tight">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

export function RoadmapFilterGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 my-4">
      {children}
    </div>
  );
}

export function RoadmapPathStrip({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/30 border border-border/50 rounded-lg p-3 mb-6 text-sm text-muted-foreground leading-relaxed">
      {children}
    </div>
  );
}

// ----------------------------------------------------
// Reusable Roadmap Section UI
// ----------------------------------------------------

export function RoadmapSectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mt-8 mb-3 pb-1.5 border-b border-border/50">
      {title}
    </div>
  );
}

// ----------------------------------------------------
// Reusable Roadmap Resource Card UI
// ----------------------------------------------------

export interface RoadmapBadgeProps {
  level: "Beginner" | "Intermediate" | "Advanced" | "Tool" | "Hidden gem";
}

export function RoadmapBadge({ level }: RoadmapBadgeProps) {
  let styles = "bg-muted text-muted-foreground";
  switch (level) {
    case "Beginner":
      styles = "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      break;
    case "Intermediate":
      styles = "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      break;
    case "Advanced":
      styles = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      break;
    case "Tool":
      styles = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      break;
    case "Hidden gem":
      styles = "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20";
      break;
  }
  
  return (
    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0", styles)}>
      {level}
    </span>
  );
}

export function RoadmapCard({
  tags,
  badges,
  title,
  url,
  meta,
  description,
  learn,
}: {
  tags: string[];
  badges: string[];
  title: string;
  url: string;
  meta: string;
  description: string;
  learn?: string;
}) {
  return (
    <div className="bg-card border border-border/60 hover:border-border rounded-xl p-4 mb-3 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
        <div className="flex gap-1.5">
          {badges.map(b => (
            <RoadmapBadge key={b} level={b as any} />
          ))}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground leading-tight">
            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-primary/50 underline-offset-2">
              {title}
            </a>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{meta}</div>
        </div>
      </div>
      <div className="text-[13px] text-foreground/80 leading-relaxed mb-2.5">
        {description}
      </div>
      {learn && (
        <div className="text-xs text-muted-foreground leading-normal mt-1 border-l-2 border-primary/20 pl-2">
          {learn}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tags.map(t => (
          <span key={t} className="text-[10px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Reusable Roadmap Project UI
// ----------------------------------------------------

export function RoadmapProjectGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      {children}
    </div>
  );
}

export function RoadmapProjectCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-1 transition-all hover:bg-muted/20">
      <div className="text-xl font-bold tracking-tighter text-muted-foreground/30">{num}</div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground leading-relaxed flex-1">{desc}</div>
    </div>
  );
}
