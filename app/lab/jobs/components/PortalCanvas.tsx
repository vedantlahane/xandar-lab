"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Globe, MapPin, Layers, ArrowUpDown, ChevronDown, ChevronUp, Bookmark } from "lucide-react";
import { useJobsContext } from "../context/JobsContext";
import type { Portal } from "../data/portals";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { cn } from "@/lib/utils";
import PortalSidebar from "./PortalSidebar";

// filter types
type FilterType = "All" | Portal["type"];
type FilterInternational = "All" | "Yes" | "No";
type FilterRemote = "All" | "Yes" | "No";
type FilterRegion = "All" | string;
type SortOption = "Name" | "Type";

const SORT_ITEMS: { value: SortOption; label: string }[] = [
  { value: "Name", label: "Name" },
  { value: "Type", label: "Type" },
];

export default function PortalCanvas() {
  const { portals, loadMorePortals, hasMorePortals } = useJobsContext();

  const [typeFilter, setTypeFilter] = useState<FilterType>("All");
  const [intlFilter, setIntlFilter] = useState<FilterInternational>("All");
  const [remoteFilter, setRemoteFilter] = useState<FilterRemote>("All");
  const [regionFilter, setRegionFilter] = useState<FilterRegion>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("Name");
  const [sortDesc, setSortDesc] = useState(false);

  const filtered = useMemo(() => {
    let result = portals.filter((p) => {
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (regionFilter !== "All" && p.region !== regionFilter) return false;
      if (intlFilter === "Yes" && !p.international) return false;
      if (intlFilter === "No" && p.international) return false;
      if (remoteFilter === "Yes" && !p.remote) return false;
      if (remoteFilter === "No" && p.remote) return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortOption === "Name") cmp = a.name.localeCompare(b.name);
      else if (sortOption === "Type") cmp = a.type.localeCompare(b.type);
      return sortDesc ? -cmp : cmp;
    });

    return result;
  }, [portals, typeFilter, regionFilter, intlFilter, remoteFilter, searchQuery, sortOption, sortDesc]);

  const groupedPortals = useMemo(() => {
    const groups: { title: string; portals: Portal[] }[] = [];
    filtered.forEach(p => {
      let title = sortOption === "Name" ? p.name[0].toUpperCase() : p.type;
      if (!title || !title.trim()) title = "#";

      let group = groups.find(g => g.title === title);
      if (!group) {
        group = { title, portals: [] };
        groups.push(group);
      }
      group.portals.push(p);
    });
    return groups;
  }, [filtered, sortOption]);

  const types = useMemo(
    () => Array.from(new Set(portals.map((p) => p.type))) as Portal["type"][],
    [portals],
  );

  const regions = useMemo(
    () => Array.from(
      new Set(portals.map((p) => p.region).filter(Boolean)),
    ) as string[],
    [portals],
  );

  const totalCount = portals.length;
  const internationalCount = portals.filter(p => p.international).length;
  const remoteCount = portals.filter(p => p.remote).length;

  const getTypeColor = (type: string, isActive: boolean) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
    const index = types.indexOf(type as Portal["type"]);
    const color = colors[index % colors.length];

    const activeColors = [
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
    ];

    return {
      dot: color,
      active: activeColors[index % activeColors.length]
    };
  };

  return (
    <div className="relative h-full">
      {/* top fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      <PortalSidebar />

      {/* scroll container */}
      <div
        id="portal-scroll-container"
        className="h-full overflow-y-auto no-scrollbar overscroll-contain"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 min-h-full">

            {/* sidebar filters */}
            <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
              <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)]">

                {/* Stats card */}
                <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    Overview
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-foreground">{totalCount}</div>
                      <div className="text-[10px] text-muted-foreground">Total</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-500">{internationalCount}</div>
                      <div className="text-[10px] text-muted-foreground">Intl</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-500">{remoteCount}</div>
                      <div className="text-[10px] text-muted-foreground">Remote</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                    Portal Type
                  </h3>
                  {["All", ...types].map((f) => {
                    const isActive = typeFilter === f;
                    if (f === "All") {
                      return (
                        <button
                          key={f}
                          onClick={() => setTypeFilter("All")}
                          className={cn(
                            "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                          )}
                        >
                          <Layers className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground/50")} />
                          <span className="truncate">All Types</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={f}
                        onClick={() => setTypeFilter(f as FilterType)}
                        className={cn(
                          "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                        )}
                      >
                        <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", getTypeColor(f, isActive).dot)} />
                        <span className="truncate">{f}</span>
                      </button>
                    );
                  })}
                </div>

                {regions.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                      Region
                    </h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {["All", ...regions].map((r) => {
                        const isActive = regionFilter === r;
                        return (
                          <button
                            key={r}
                            onClick={() => setRegionFilter(r as FilterRegion)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1",
                              isActive
                                ? "bg-primary/10 text-primary border-primary/30"
                                : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                            )}
                          >
                            {isActive && <MapPin className="h-3 w-3" />}
                            {r === "All" ? "All Regions" : r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                    International
                  </h3>
                  <div className="flex gap-1.5">
                    {(["All", "Yes", "No"] as FilterInternational[]).map((f) => {
                      const isActive = intlFilter === f;
                      return (
                        <button
                          key={f}
                          onClick={() => setIntlFilter(f)}
                          className={cn(
                            "flex items-center justify-center flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            isActive
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                          )}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                    Remote Friendly
                  </h3>
                  <div className="flex gap-1.5">
                    {(["All", "Yes", "No"] as FilterRemote[]).map((f) => {
                      const isActive = remoteFilter === f;
                      return (
                        <button
                          key={f}
                          onClick={() => setRemoteFilter(f)}
                          className={cn(
                            "flex items-center justify-center flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                          )}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                    <ArrowUpDown className="h-3 w-3" />
                    Sort by
                  </h3>
                  <div className="space-y-0.5">
                    {SORT_ITEMS.map((item) => {
                      const isActive = sortOption === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => {
                            if (isActive) setSortDesc(!sortDesc);
                            else { setSortOption(item.value); setSortDesc(true); }
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
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

              </div>
            </aside>

            {/* content column */}
            <div className="space-y-4 pb-48 pt-8">
              {/* sticky search bar */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                <SearchBar
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  placeholder="Search portals..."
                />
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium">No portals match your filters</p>
                </div>
              ) : (
                groupedPortals.map((group) => (
                  <section
                    key={group.title}
                    id={`portal-${group.title}`}
                    data-category
                    data-category-title={group.title}
                    className="space-y-0 mb-8"
                  >
                    <div className="sticky top-16 z-10 bg-background/95 py-2 backdrop-blur mb-2">
                      <h2 className="text-lg font-semibold">{group.title}</h2>
                    </div>
                    {group.portals.map((p) => (
                      <a
                        key={p.id}
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "group block w-full border-b border-border/40 px-4 py-3 text-left backdrop-blur-md",
                          "transition-all hover:bg-linear-to-r hover:from-white/5 hover:to-white/10 dark:hover:from-white/5 dark:hover:to-white/10"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{p.name}</span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {p.type}
                          {p.region ? ` – ${p.region}` : ''}
                          {p.remote ? ' • remote-friendly' : ''}
                          {p.international ? ' • international' : ''}
                        </div>
                      </a>
                    ))}
                  </section>
                ))
              )}
              {hasMorePortals && (
                <div className="text-center py-6">
                  <button
                    className="text-primary underline"
                    onClick={() => loadMorePortals()}
                  >
                    Load more portals
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
