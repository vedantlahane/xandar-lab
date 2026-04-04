"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Filter, Activity, Clock3, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { IIdea } from "@/models/Idea";

type Stats = {
  totalIdeas: number;
  totalDomains: number;
  avgConfidence: number;
  lastRefreshed: string | null;
};

type APIResponse = {
  ideas: IIdea[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta: {
    domains: { name: string; count: number }[];
  };
};

export default function IdeasCatalogPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [domainFilter, setDomainFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("confidence");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetch("/api/ideas/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      domain: domainFilter,
      q: search,
      sort,
      page: page.toString(),
      limit: limit.toString(),
    });

    fetch(`/api/ideas?${params.toString()}`)
      .then((res) => res.json())
      .then((resp) => {
        setData(resp);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [domainFilter, search, sort, page]);

  // Handle Search Input Debounce conceptually or directly
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-10 pb-32 px-6 lg:px-12 h-full overflow-y-auto thin-scrollbar">
      {/* Header / Stats */}
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Project Ideas Lab</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          AI-validated startup and side project ideas, generated autonomously and refreshed daily by the Forge Pipeline.
        </p>

        {stats && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              <HardDrive className="h-4 w-4" />
              {stats.totalIdeas} ideas
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
              <Filter className="h-4 w-4" />
              {stats.totalDomains} domains
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
              <Activity className="h-4 w-4" />
              Avg {stats.avgConfidence}% confidence
            </Badge>
            {stats.lastRefreshed && (
              <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm border-border/50 text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Refreshed {new Date(stats.lastRefreshed).toLocaleDateString()}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Filters Area */}
      <div className="rounded-xl border border-white/40 dark:border-white/5 bg-linear-to-br from-white/60 to-white/30 dark:from-zinc-900/40 dark:to-zinc-900/10 backdrop-blur-md shadow-xl shadow-black/5 p-6 mb-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              className="pl-9 h-11 bg-background/50 border-border/50 text-base"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-semibold text-muted-foreground">Sort:</span>
            <select
              title="Sort Ideas"
              aria-label="Sort Ideas"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-lg border border-border/50 bg-background/50 px-4 text-sm focus:border-primary/50 outline-none"
            >
              <option value="confidence">Highest Confidence ▾</option>
              <option value="popular">Most Popular ▾</option>
              <option value="newest">Newest ▾</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setDomainFilter("all");
              setPage(1);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
              domainFilter === "all"
                ? "bg-primary/10 text-primary border-primary/30"
                : "border-border/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            All {stats ? `(${stats.totalIdeas})` : ""}
          </button>
          {data?.meta?.domains?.sort((a, b) => b.count - a.count).map((d) => (
            <button
              key={d.name}
              onClick={() => {
                setDomainFilter(d.name);
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border capitalize",
                domainFilter === d.name
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {d.name.replace(/-/g, " ")} <span className="opacity-60 ml-0.5">({d.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mb-4 text-sm font-medium text-muted-foreground">
        {data ? `Showing ${data.ideas.length} of ${data.pagination.total} ideas` : "Loading..."}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 rounded-xl border border-border/40 bg-card/40" />
          ))}
        </div>
      ) : !data?.ideas || data.ideas.length === 0 ? (
        <div className="text-center py-24 bg-card/30 rounded-xl border border-border/50 border-dashed">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No ideas found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
            Try adjusting your search terms or selecting a different domain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data?.ideas.map((idea) => {
            const tone = idea.confidence >= 80 
              ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
              : idea.confidence >= 60 
                ? "text-amber-500 bg-amber-500/10 border-amber-500/20" 
                : "text-red-500 bg-red-500/10 border-red-500/20";
            
            return (
              <Link 
                href={`/lab/ideas/${idea.slug}`} 
                key={idea._id}
                className="group flex flex-col rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/40 hover:shadow-md transition-all h-full"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-muted/50 text-muted-foreground">
                    {idea.domain.replace(/-/g, " ")}
                  </span>
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded border", tone)}>
                    ● {idea.confidence}
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {idea.title}
                </h3>
                
                <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3 mb-6 flex-1">
                  {idea.problem}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {idea.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-background border border-border/60 text-muted-foreground font-medium">
                        {tech}
                      </span>
                    ))}
                    {idea.techStack.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-transparent text-muted-foreground">
                        +{idea.techStack.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3 w-3" />
                      {idea.timeline || "2-4 weeks"}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-foreground/70">
                      👍 {idea.upvotes || 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Prev
          </Button>
          <span className="text-sm text-muted-foreground mx-4">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Custom Generation CTA */}
      <div className="mt-24 pt-12 border-t border-border/50 text-center">
        <h3 className="text-xl font-bold mb-3">Can't find what you need?</h3>
        <p className="text-muted-foreground mb-6">
          Generate custom, personalized ideas strictly tailored to your background and skills.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold px-8 hover:scale-105 transition-transform">
          <Link href="/lab/ideas/forge">
            <Sparkles className="h-4 w-4 mr-2" />
            Launch Idea Forge
          </Link>
        </Button>
      </div>
    </div>
  );
}
