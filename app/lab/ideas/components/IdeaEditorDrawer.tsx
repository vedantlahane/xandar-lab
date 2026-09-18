// app/lab/ideas/components/IdeaEditorDrawer.tsx
"use client";

import { useState } from "react";
import { BaseDrawer } from "@/app/lab/components/shared/BaseDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Save, Lightbulb, Sparkles, Tag, X,
    Plus, Loader2, Target, Clock3, DollarSign, AlertTriangle
} from "lucide-react";

interface IdeaEditorDrawerProps {
    onClose: () => void;
    onSaved: (newIdea: any) => void;
}

const COMMON_DOMAINS = [
    "Developer Tools",
    "AI & Machine Learning",
    "Productivity",
    "Open Source",
    "FinTech",
    "Web3 / Crypto",
    "Design & UX",
    "Infrastructure",
];

const TIMELINES = [
    "1-2 weeks",
    "2-4 weeks",
    "1-2 months",
    "2-3 months",
];

const COMPLEXITY_OPTIONS: ("low" | "medium" | "high")[] = [
    "low", "medium", "high"
];

export function IdeaEditorDrawer({
    onClose,
    onSaved,
}: IdeaEditorDrawerProps) {
    const [title, setTitle] = useState("");
    const [domain, setDomain] = useState("Developer Tools");
    const [customDomain, setCustomDomain] = useState("");
    const [targetUser, setTargetUser] = useState("Developers & Engineers");
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [timeline, setTimeline] = useState("2-4 weeks");
    const [complexity, setComplexity] = useState<"low" | "medium" | "high">("medium");
    const [monetization, setMonetization] = useState("");
    const [risks, setRisks] = useState("");

    // Tech stack
    const [techStack, setTechStack] = useState<string[]>([]);
    const [techInput, setTechInput] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddTech = () => {
        const trimmed = techInput.trim();
        if (trimmed && !techStack.includes(trimmed)) {
            setTechStack([...techStack, trimmed]);
            setTechInput("");
        }
    };

    const handleRemoveTech = (t: string) => {
        setTechStack(techStack.filter((item) => item !== t));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!problem.trim()) {
            setError("Problem statement is required");
            return;
        }
        if (!solution.trim()) {
            setError("Solution description is required");
            return;
        }

        const effectiveDomain = domain === "Other" && customDomain.trim() ? customDomain.trim() : domain;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    domain: effectiveDomain,
                    targetUser: targetUser.trim(),
                    problem: problem.trim(),
                    solution: solution.trim(),
                    techStack,
                    timeline,
                    complexity,
                    monetization: monetization.trim() || undefined,
                    risks: risks.trim() || undefined,
                    confidence: 85,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to submit idea");
            }

            onSaved(data.idea);
        } catch (err: any) {
            setError(err.message || "Something went wrong submitting your idea");
        } finally {
            setSaving(false);
        }
    };

    const headerLeft = (
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Submit Community Idea
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[11px] text-muted-foreground">Community Catalog</span>
        </div>
    );

    const headerRight = (
        <div className="flex items-center gap-2 mr-2">
            <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="h-7 px-3 text-xs gap-1.5 font-medium shadow-sm"
            >
                {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Save className="h-3.5 w-3.5" />
                )}
                Publish Idea
            </Button>
        </div>
    );

    return (
        <BaseDrawer
            onClose={onClose}
            defaultWidth="720px"
            defaultHeight="700px"
            headerLeft={headerLeft}
            headerRight={headerRight}
        >
            <div className="p-5 sm:p-6 space-y-5">
                {error && (
                    <div className="px-3.5 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Idea Title
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Real-Time Distributed Rate Limiter Service"
                        className="text-base font-semibold h-10"
                    />
                </div>

                {/* Domain & Target User */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Domain / Field
                        </label>
                        <select
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        >
                            {COMMON_DOMAINS.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                            <option value="Other">Other (Custom)</option>
                        </select>
                        {domain === "Other" && (
                            <Input
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="Specify custom domain..."
                                className="h-8 text-xs mt-1.5"
                            />
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" /> Target User
                        </label>
                        <Input
                            value={targetUser}
                            onChange={(e) => setTargetUser(e.target.value)}
                            placeholder="e.g. Backend Engineers, Indie Hackers"
                            className="h-9 text-xs"
                        />
                    </div>
                </div>

                {/* Problem Statement */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        The Problem
                    </label>
                    <textarea
                        rows={3}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="What bottleneck, friction, or unmet need does this idea address?"
                        className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
                    />
                </div>

                {/* Proposed Solution */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        The Solution
                    </label>
                    <textarea
                        rows={3}
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="How does your proposed architecture or product solve the problem cleanly?"
                        className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
                    />
                </div>

                {/* Tech Stack */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Tag className="h-3 w-3" /> Recommended Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {techStack.map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted border border-border"
                            >
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTech(tech)}
                                    className="hover:text-destructive transition-colors ml-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTech();
                                }
                            }}
                            placeholder="Add technology (e.g. Go, Redis, Next.js) and press Enter"
                            className="h-8 text-xs flex-1"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddTech}
                            className="h-8 px-2.5 text-xs gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add
                        </Button>
                    </div>
                </div>

                {/* Timeline and Complexity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Clock3 className="h-3 w-3" /> Estimated Build Timeline
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {TIMELINES.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTimeline(t)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                                        timeline === t
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Complexity
                        </label>
                        <div className="flex gap-1.5">
                            {COMPLEXITY_OPTIONS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setComplexity(c)}
                                    className={cn(
                                        "capitalize px-3 py-1 rounded-md text-xs font-medium border transition-all",
                                        complexity === c
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                                    )}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monetization & Risks (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" /> Monetization Angle (Optional)
                        </label>
                        <Input
                            value={monetization}
                            onChange={(e) => setMonetization(e.target.value)}
                            placeholder="e.g. Freemium API, GitHub Sponsors, Hosted SaaS"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <AlertTriangle className="h-3 w-3 text-amber-500" /> Key Risks (Optional)
                        </label>
                        <Input
                            value={risks}
                            onChange={(e) => setRisks(e.target.value)}
                            placeholder="e.g. Cold start latency, API rate limits"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
