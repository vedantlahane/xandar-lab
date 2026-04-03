"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Sparkles, X, Target, Briefcase, Coins, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DOMAIN_OPTIONS,
  SKILL_SUGGESTIONS,
} from "@/app/ideas/components/ideaForgeConfig";
import type { UserPreferences } from "@/lib/ideaforge/types";

// ── Shared Config Icons ────────────────────────────────────────────────────────
const ADVANCED_PREF_OPTIONS = {
  timeline: [
    { value: "", label: "Not specified" },
    { value: "1 week", label: "1 week" },
    { value: "2-4 weeks", label: "2-4 weeks" },
    { value: "1-2 months", label: "1-2 months" },
  ],
  goal: [
    { value: "", label: "Not specified" },
    { value: "learn_portfolio", label: "Learn & Portfolio" },
    { value: "side_project", label: "Side Project" },
    { value: "potential_startup", label: "Potential Startup" },
  ],
  monetization: [
    { value: "", label: "Not specified" },
    { value: "not_important", label: "Not important" },
    { value: "nice_to_have", label: "Nice to have" },
    { value: "primary_goal", label: "Primary goal" },
  ],
} as const;

type IdeaForgeFormProps = {
  domain: string;
  skills: string[];
  preferences: UserPreferences;
  isGenerating: boolean;
  onChange: (payload: {
    domain: string;
    skills: string[];
    preferences: UserPreferences;
  }) => void;
  onSubmit: () => void;
};

export function IdeaForgeForm(props: IdeaForgeFormProps) {
  const { domain, skills, preferences, isGenerating, onChange, onSubmit } = props;

  const [selectedDomain, setSelectedDomain] = useState<string>(
    DOMAIN_OPTIONS.includes(domain as (typeof DOMAIN_OPTIONS)[number]) ? domain : "custom"
  );
  const [skillInput, setSkillInput] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const normalizedSkills = useMemo(
    () => new Set(skills.map((item) => item.trim().toLowerCase())),
    [skills]
  );

  const addSkill = (raw: string) => {
    const skill = raw.trim();
    if (!skill) return;
    if (normalizedSkills.has(skill.toLowerCase())) return;

    onChange({
      domain,
      preferences,
      skills: [...skills, skill],
    });

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    onChange({
      domain,
      preferences,
      skills: skills.filter((value) => value !== skill),
    });
  };

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    onChange({
      domain,
      skills,
      preferences: {
        ...preferences,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header section is managed by workspace, we focus on the form controls */}

      {/* Domain */}
      <div className="space-y-3">
        <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest">
          Domain Focus
        </label>
        <div className="relative mb-3">
          <select
            value={selectedDomain}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedDomain(value);
              if (value !== "custom") {
                onChange({ domain: value, skills, preferences });
              }
            }}
            disabled={isGenerating}
            className="w-full appearance-none bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-background hover:border-border transition-colors backdrop-blur-sm shadow-sm"
          >
            {DOMAIN_OPTIONS.map((option) => (
               <option key={option} value={option}>{option}</option>
            ))}
            <option value="custom">Custom Domain...</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {selectedDomain === "custom" && (
          <Input
            className="w-full bg-background/50 border-border/50 rounded-lg px-4 py-3 text-sm focus:bg-background transition-colors shadow-sm"
            value={domain}
            onChange={(event) => {
              onChange({ domain: event.target.value, skills, preferences });
            }}
            placeholder="E.g., DevTools for Remote Teams"
            disabled={isGenerating}
          />
        )}
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest flex justify-between items-center">
          <span>Core Capabilities (Skills)</span>
          <span className="text-[10px] lowercase normal-case text-muted-foreground/50">{skills.length} added</span>
        </label>
        <div className="flex gap-2">
          <Input
            className="w-full bg-background/50 border-border/50 rounded-lg px-4 py-3 text-sm focus:bg-background transition-colors shadow-sm"
            value={skillInput}
            onChange={(event) => setSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill(skillInput);
              }
            }}
            placeholder="Type a skill (e.g. React) and press Enter"
            disabled={isGenerating}
          />
          <Button
            type="button"
            variant="outline"
            className="h-12 border-border/50 hover:bg-muted/30"
            onClick={() => addSkill(skillInput)}
            disabled={isGenerating}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {skills.length === 0 ? (
            <span className="text-xs text-muted-foreground italic pl-1">Add at least one key skill to personalize ideas.</span>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
                <button
                  type="button"
                  className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                  onClick={() => removeSkill(skill)}
                  disabled={isGenerating}
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Suggested Skills */}
        {skills.length < 5 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SKILL_SUGGESTIONS.filter(skill => !normalizedSkills.has(skill.toLowerCase())).slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                disabled={isGenerating}
                className="rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground disabled:opacity-50"
              >
                + {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-border/50 w-full my-6" />

      {/* Advanced Settings */}
      <div className="space-y-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left group"
          onClick={() => setAdvancedOpen((current) => !current)}
        >
          <div className="flex items-center gap-2">
             <div className="h-6 w-6 rounded-md bg-muted/40 flex items-center justify-center border border-border/50 group-hover:bg-muted/60 transition-colors">
               <Target className="h-3.5 w-3.5 text-muted-foreground" />
             </div>
             <span className="text-sm font-semibold tracking-wide">Advanced Constraints</span>
          </div>
          <div className="h-7 w-7 rounded-full bg-muted/20 flex items-center justify-center">
            {advancedOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </button>

        {advancedOpen && (
          <div className="grid gap-4 sm:grid-cols-3 pt-3">
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest pl-1">MVP Timeline</label>
                <div className="relative">
                   <select
                     value={preferences.timeline || ""}
                     onChange={(e) => updatePreference("timeline", e.target.value as UserPreferences["timeline"])}
                     className="w-full appearance-none bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary/50 hover:border-border transition-colors text-foreground/80"
                     disabled={isGenerating}
                   >
                     {ADVANCED_PREF_OPTIONS.timeline.map((opt) => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest pl-1">Goal Focus</label>
                <div className="relative">
                   <select
                     value={preferences.goal || ""}
                     onChange={(e) => updatePreference("goal", e.target.value as UserPreferences["goal"])}
                     className="w-full appearance-none bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary/50 hover:border-border transition-colors text-foreground/80"
                     disabled={isGenerating}
                   >
                     {ADVANCED_PREF_OPTIONS.goal.map((opt) => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest pl-1">Monetization</label>
                <div className="relative">
                   <select
                     value={preferences.monetization || ""}
                     onChange={(e) => updatePreference("monetization", e.target.value as UserPreferences["monetization"])}
                     className="w-full appearance-none bg-background/50 border border-border/50 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary/50 hover:border-border transition-colors text-foreground/80"
                     disabled={isGenerating}
                   >
                     {ADVANCED_PREF_OPTIONS.monetization.map((opt) => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                </div>
             </div>
          </div>
        )}
      </div>

      <Button
        className="w-full h-12 text-base gap-2 bg-primary text-primary-foreground shadow-md font-semibold mt-4"
        disabled={isGenerating || !domain.trim() || skills.length === 0}
        onClick={onSubmit}
      >
        <Flame className="h-5 w-5" />
        {isGenerating ? "Forging Your Ideas..." : "Forge Ideas"}
      </Button>
    </div>
  );
}
