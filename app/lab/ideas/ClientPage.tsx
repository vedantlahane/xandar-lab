"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { IdeaDrawer } from "./components/IdeaDrawer";
import { Search, Sparkles, Filter, Activity, Clock3, HardDrive, Dices, Loader2, ArrowUpDown, ChevronDown, ChevronUp, Layers, Tag, Target, Calendar } from "lucide-react";
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
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  // Infinite scroll states
  const [ideas, setIdeas] = useState<IIdea[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filters
  const [domainFilter, setDomainFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("confidence");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const paramsObj = useParams();
  const slug = paramsObj?.slug as string | undefined;

  const [activeIdea, setActiveIdea] = useState<IIdea | null>(null);

  // Sync active idea on external URL changes
  useEffect(() => {
    if (slug) {
      if (!activeIdea || activeIdea.slug !== slug) {
        fetch(`/api/ideas/${slug}`)
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((data) => setActiveIdea(data))
          .catch(() => router.push("/lab/ideas"));
      }
    } else {
      setActiveIdea(null);
    }
  }, [slug, router]);

  useEffect(() => {
    fetch("/api/ideas/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      domain: domainFilter,
      q: search,
      sort: sort === "confidence" ? (sortDesc ? "confidence" : "confidence_asc") : sortDesc ? sort : `${sort}_asc`,
      page: page.toString(),
      limit: limit.toString(),
    });

    fetch(`/api/ideas?${params.toString()}`)
      .then((res) => res.json())
      .then((resp) => {
        setIdeas((prev) => page === 1 ? resp.ideas : [...prev, ...resp.ideas]);
        setHasMore(page < resp.pagination.totalPages);
        if (page === 1) setData(resp); // Keeping data for meta/domains
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [domainFilter, search, sort, page]);

  // Handle Search Input Debounce conceptually or directly
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  async function handleSurpriseMe() {
    setLoadingSurprise(true);
    try {
      const res = await fetch("/api/ideas/random");
      if (!res.ok) throw new Error();
      const idea = await res.json();
      router.push(`/lab/ideas/${idea.slug}`);
    } catch {
      alert("No ideas found for surprise me currently.");
    } finally {
      setLoadingSurprise(false);
    }
  }

  // UI aesthetics map
  const getConfidenceTone = (conf: number) => {
    if (conf >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (conf >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  const getConfidenceText = (conf: number) => {
    if (conf >= 80) return "text-emerald-500";
    if (conf >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const SORT_ITEMS = [
    { value: "confidence", label: "Confidence" },
    { value: "popular", label: "Upvotes" },
    { value: "newest", label: "Date Added" },
  ];

  return (
    <div className="relative h-full">
      {/* Top Fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      <div id="ideas-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 min-h-full pb-32">
            
            {/* Left Column: Filters */}
            <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
              <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">
                
                {/* Stats */}
                {stats && (
                  <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Target className="h-4 w-4 text-emerald-500" />
                      Overview
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-foreground">{stats.totalIdeas}</div>
                        <div className="text-[10px] text-muted-foreground">Ideas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">{stats.totalDomains}</div>
                        <div className="text-[10px] text-muted-foreground">Domains</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-amber-500">{stats.avgConfidence}%</div>
                        <div className="text-[10px] text-muted-foreground">Avg Conf</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Domains Filter */}
                <div className="space-y-0.5">
                  <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex justify-between items-center">
                    Domains
                  </h3>
                  <button
                    onClick={() => { setDomainFilter("all"); setPage(1); }}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                      domainFilter === "all" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Layers className={cn("h-3.5 w-3.5 shrink-0", domainFilter === "all" ? "text-primary" : "text-muted-foreground/50")} />
                    <span className="truncate">All Domains</span>
                  </button>
                  {data?.meta?.domains?.sort((a, b) => b.count - a.count).map((d) => (
                    <button
                      key={d.name}
                      onClick={() => { setDomainFilter(d.name); setPage(1); }}
                      className={cn(
                        "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                        domainFilter === d.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      <span className="truncate capitalize">{d.name.replace(/-/g, " ")}</span>
                      <span className="text-[10px] opacity-60 ml-2">{d.count}</span>
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="space-y-1">
                  <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                    <ArrowUpDown className="h-3 w-3" /> Sort by
                  </h3>
                  <div className="space-y-0.5">
                    {SORT_ITEMS.map((item) => {
                      const isActive = sort === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => {
                            if (isActive) setSortDesc(!sortDesc);
                            else { setSort(item.value); setSortDesc(true); setPage(1); }
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                            isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          )}
                        >
                          <span>{item.label}</span>
                          {isActive ? (
                            sortDesc ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={handleSurpriseMe}
                    disabled={loadingSurprise}
                    className="w-full justify-center border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors text-xs"
                  >
                    {loadingSurprise ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Dices className="w-3.5 h-3.5 mr-2" />}
                    Feeling Lucky
                  </Button>
                </div>
              </div>
            </aside>

            {/* Right Column: Search & Content */}
            <div className="space-y-4 pt-6">
              
              {/* Sticky Search */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <Input
                    placeholder="Search ideas, domains, or frameworks..."
                    className="pl-9 h-11 bg-card/50 border-border/40 text-sm w-full transition-all hover:bg-card focus:bg-card focus:ring-1 focus:ring-primary/30"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {loading && page === 1 ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 rounded-lg bg-card/40 border border-border/20 w-full" />
                  ))}
                </div>
              ) : (!ideas || ideas.length === 0) ? (
                <div className="text-center py-24 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-40 text-primary" />
                  <p className="text-lg font-medium text-foreground">No ideas match</p>
                  <p className="text-sm mt-1 mb-6">Try clearing your filters or search constraints.</p>
                  <Button variant="outline" onClick={() => { setDomainFilter("all"); setSearch(""); }}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-0 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-border/20 hidden md:block -ml-6" />
                  {ideas.map((idea) => {
                    const tone = getConfidenceTone(idea.confidence);
                    const textColor = getConfidenceText(idea.confidence);

                    return (
                      <button
                        key={idea._id}
                        onClick={() => router.push(`/lab/ideas/${idea.slug}`)}
                        className={cn(
                          "group relative w-full border-b border-border/40 px-4 py-4 text-left backdrop-blur-md",
                          "transition-all hover:bg-linear-to-r hover:from-white/5 hover:to-white/10 dark:hover:from-white/5 dark:hover:to-white/10"
                        )}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 w-full">
                              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", tone, "shrink-0")}>
                                {idea.confidence}%
                              </span>
                              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {idea.title}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline-block">
                              {idea.domain.replace(/-/g, " ")}
                            </span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground/80 line-clamp-1 pl-[46px]">
                            {idea.problem}
                          </p>

                          <div className="flex flex-wrap gap-2 text-[10px] font-medium text-muted-foreground pl-[46px] mt-1 items-center">
                            {idea.signalDate && (() => {
                              const ageDays = (Date.now() - new Date(idea.signalDate).getTime()) / (1000 * 60 * 60 * 24);
                              if (ageDays < 14) return <span className="text-emerald-500 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">Fresh</span>;
                              if (ageDays < 42) return <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Recent</span>;
                              return <span className="text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Archived</span>;
                            })()}
                            
                            <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" /> {idea.timeline || "2-4 weeks"}</span>
                            {idea.techStack && idea.techStack.length > 0 && (
                               <span className="flex items-center gap-1 opacity-70 border-l border-border/50 pl-2">
                                 <Tag className="h-3 w-3" /> {idea.techStack.slice(0, 2).join(", ")} {idea.techStack.length > 2 && "..."}
                               </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Infinite Scroll Sentinel */}
              <div ref={sentinelRef} className="h-10 mt-8 flex flex-col items-center justify-center">
                {loading && page > 1 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Loading more...</span>
                  </div>
                )}
                {!hasMore && ideas.length > 0 && (
                  <p className="text-center text-muted-foreground/50 text-xs font-medium py-8 mt-4">
                    End of catalog. Try searching or building a custom list.
                  </p>
                )}
              </div>

              {/* Custom Generation CTA */}
              <div className="mt-16 pt-8 border-t border-border/30 text-center">
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Link href="/lab/ideas/forge">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Launch Custom Idea Forge →
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />

      {/* Idea Overlay Drawer */}
      <AnimatePresence>
        {activeIdea && (
          <IdeaDrawer idea={activeIdea} onClose={() => router.push("/lab/ideas")} />
        )}
      </AnimatePresence>
    </div>
  );
}
