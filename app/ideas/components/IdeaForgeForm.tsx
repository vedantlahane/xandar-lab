"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DOMAIN_OPTIONS,
  SKILL_SUGGESTIONS,
} from "@/app/ideas/components/ideaForgeConfig";
import type { UserPreferences } from "@/lib/ideaforge/types";

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
    <Card className="border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-950/40">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Idea Forge Input
        </CardTitle>
        <CardDescription>
          Share your domain and skill profile. The agent team will challenge and refine ideas before ranking final bets.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Domain</label>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
            value={selectedDomain}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedDomain(value);

              if (value !== "custom") {
                onChange({
                  domain: value,
                  skills,
                  preferences,
                });
              }
            }}
            disabled={isGenerating}
          >
            {DOMAIN_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="custom">Custom Domain</option>
          </select>

          <Input
            value={selectedDomain === "custom" ? domain : ""}
            onChange={(event) => {
              setSelectedDomain("custom");
              onChange({
                domain: event.target.value,
                skills,
                preferences,
              });
            }}
            placeholder="Or type your own domain"
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Skills</label>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill(skillInput);
                }
              }}
              placeholder="Type a skill and press Enter"
              disabled={isGenerating}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addSkill(skillInput)}
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <span className="text-sm text-muted-foreground">Add at least one skill to personalize output.</span>
            ) : (
              skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 px-2 py-1">
                  {skill}
                  <button
                    type="button"
                    className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    disabled={isGenerating}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {SKILL_SUGGESTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                disabled={isGenerating || normalizedSkills.has(skill.toLowerCase())}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            onClick={() => setAdvancedOpen((current) => !current)}
          >
            {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Advanced Preferences
          </button>

          {advancedOpen ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">MVP Timeline</label>
                <select
                  value={preferences.timeline || ""}
                  onChange={(event) => updatePreference("timeline", event.target.value as UserPreferences["timeline"])}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-2 text-sm"
                  disabled={isGenerating}
                >
                  <option value="">Not specified</option>
                  <option value="1 week">1 week</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Goal</label>
                <select
                  value={preferences.goal || ""}
                  onChange={(event) => updatePreference("goal", event.target.value as UserPreferences["goal"])}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-2 text-sm"
                  disabled={isGenerating}
                >
                  <option value="">Not specified</option>
                  <option value="learn_portfolio">Learn &amp; Portfolio</option>
                  <option value="side_project">Side Project</option>
                  <option value="potential_startup">Potential Startup</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Monetization</label>
                <select
                  value={preferences.monetization || ""}
                  onChange={(event) =>
                    updatePreference("monetization", event.target.value as UserPreferences["monetization"])
                  }
                  className="w-full rounded-md border border-input bg-transparent px-2 py-2 text-sm"
                  disabled={isGenerating}
                >
                  <option value="">Not specified</option>
                  <option value="not_important">Not important</option>
                  <option value="nice_to_have">Nice to have</option>
                  <option value="primary_goal">Primary goal</option>
                </select>
              </div>
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          disabled={isGenerating || !domain.trim() || skills.length === 0}
          onClick={onSubmit}
        >
          {isGenerating ? "Forging Ideas..." : "Forge Ideas"}
        </Button>
      </CardContent>
    </Card>
  );
}
