"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, ThumbsUp, Bookmark, Copy, Rocket, 
  ExternalLink, ChevronDown, ChevronUp, Target, 
  ShieldAlert, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IIdea } from "@/models/Idea";

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [idea, setIdea] = useState<IIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<IIdea[]>([]);

  const [hasVoted, setHasVoted] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [openSections, setOpenSections] = useState({
    marketing: false,
    tech: false,
    evidence: false
  });

  useEffect(() => {
    if (!slug) return;
    
    // Check if voted in local storage
    const voted = localStorage.getItem(`voted_${slug}`);
    if (voted) setHasVoted(true);

    fetch(`/api/ideas/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setIdea(data);
        // Fetch related
        return fetch(`/api/ideas?domain=${data.domain}&limit=4&sort=confidence`);
      })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ideas) {
          // Exclude self
          setRelated(data.ideas.filter((i: IIdea) => i.slug !== slug).slice(0, 3));
        }
      })
      .catch((err) => {
        console.error(err);
        router.push("/lab/ideas");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleVote = async () => {
    if (hasVoted || !idea) return;

    try {
      setHasVoted(true);
      setIdea({ ...idea, upvotes: idea.upvotes + 1 });
      localStorage.setItem(`voted_${slug}`, "true");

      await fetch(`/api/ideas/${slug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "upvote" })
      });
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const toMarkdown = () => {
    if (!idea) return "";
    return `## ${idea.title}\n\n- Confidence: ${idea.confidence}\n- Domain: ${idea.domain}\n\n### Problem\n${idea.problem}\n\n### Solution\n${idea.solution}`;
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown());
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto pt-10 px-6 h-screen flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-32 bg-muted/30 rounded-md" />
        <div className="h-48 rounded-xl bg-card/40 border border-border/40 mt-4" />
      </div>
    );
  }

  if (!idea) return null;

  const tone = idea.confidence >= 80 
    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
    : idea.confidence >= 60 
      ? "text-amber-500 bg-amber-500/10 border-amber-500/20" 
      : "text-red-500 bg-red-500/10 border-red-500/20";

  return (
    <div className="max-w-[1000px] mx-auto pt-8 pb-32 px-6 lg:px-12 h-full overflow-y-auto thin-scrollbar">
      <Link 
        href="/lab/ideas" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Ideas Catalog
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-muted text-muted-foreground">
          {idea.domain.replace(/-/g, " ")}
        </span>
        <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded border", tone)}>
          Confidence {idea.confidence}%
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border border-border/50 text-foreground/70">
          {idea.complexity} complexity
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
        {idea.title}
      </h1>

      <div className="flex flex-wrap gap-3 pb-8 border-b border-border/40">
        <Button 
          onClick={handleVote} 
          disabled={hasVoted}
          className={cn(
            "h-10 px-5 transition-all shadow-sm",
            hasVoted ? "bg-primary/20 text-primary opacity-100" : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          {hasVoted ? "Upvoted" : "Upvote"}
          <span className="ml-2 font-mono text-xs opacity-80">({idea.upvotes})</span>
        </Button>
        <Button variant="outline" onClick={copyMarkdown} className="h-10 px-5 border-border/50 hover:bg-muted/30">
          <Copy className="h-4 w-4 mr-2" />
          {copyState === "copied" ? "Copied!" : "Copy MD"}
        </Button>
        <Button variant="outline" asChild className="h-10 px-5 border-border/50 bg-background hover:bg-muted/30">
          <Link href="/lab/experiments">
            <Rocket className="h-4 w-4 mr-2" />
            Launch Project
          </Link>
        </Button>
      </div>

      <div className="mt-10 space-y-12">
        {/* Core Content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Target className="h-3.5 w-3.5 text-primary" />
              </span>
              The Problem
            </h3>
            <div className="text-base text-foreground/80 leading-relaxed bg-muted/20 p-5 rounded-xl border border-border/40">
              {idea.problem}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              </span>
              The Solution
            </h3>
            <div className="text-base text-foreground/80 leading-relaxed bg-muted/20 p-5 rounded-xl border border-border/40">
              {idea.solution}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-xl border border-border/40 bg-card/30">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Target User</span>
            <p className="text-sm font-medium">{idea.targetUser}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Timeline</span>
            <p className="text-sm font-medium">{idea.timeline || "N/A"}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Monetization</span>
            <p className="text-sm font-medium">{idea.monetization || "Open Source"}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Tech Stack</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {idea.techStack.map(t => (
                 <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {idea.risks && (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Risks & Hurdles
            </h3>
            <ul className="space-y-2 text-sm text-foreground/80 pl-2 border-l-2 border-red-500/30">
              {idea.risks.split("\n").map((r, i) => <li key={i} className="pl-3">{r.replace(/^- /, "")}</li>)}
            </ul>
          </section>
        )}

        {/* Collapsibles */}
        <section className="space-y-3">
          <button
            onClick={() => toggleSection("evidence")}
            className="flex w-full items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:bg-muted/30 transition-colors group"
          >
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">🔗 Market Evidence & Links</span>
            {openSections.evidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.evidence && (
            <div className="p-4 bg-muted/10 rounded-xl border border-border/30 space-y-3">
              {idea.evidence?.length > 0 ? idea.evidence.map((ev, i) => (
                <a key={i} href={ev.url} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-background hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{ev.source}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  {ev.snippet && <span className="text-xs text-muted-foreground line-clamp-2">{ev.snippet}</span>}
                </a>
              )) : (
                <p className="text-sm text-muted-foreground italic">No specific external links attached.</p>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20 pt-10 border-t border-border/40">
          <h2 className="text-xl font-bold mb-6">Related Ideas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link href={`/lab/ideas/${r.slug}`} key={r._id} className="p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 transition-all">
                <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary">{r.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-bold text-emerald-500">{r.confidence}%</span>
                  <span>•</span>
                  <span>{r.upvotes} votes</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
