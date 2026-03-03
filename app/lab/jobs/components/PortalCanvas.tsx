"use client";

import { useState, useMemo } from "react";
import { Bookmark, ExternalLink, Search } from "lucide-react";
import { useJobsContext } from "../context/JobsContext";
import type { Portal } from "../data/portals";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";

// filter types
type FilterType = "All" | Portal["type"];
type FilterInternational = "All" | "Yes" | "No";
type FilterRemote = "All" | "Yes" | "No";
type FilterRegion = "All" | string;

export default function PortalCanvas() {
  const { portals, loadMorePortals, hasMorePortals } = useJobsContext();

  const [typeFilter, setTypeFilter] = useState<FilterType>("All");
  const [intlFilter, setIntlFilter] = useState<FilterInternational>("All");
  const [remoteFilter, setRemoteFilter] = useState<FilterRemote>("All");
  const [regionFilter, setRegionFilter] = useState<FilterRegion>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return portals.filter((p) => {
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
  }, [portals, typeFilter, regionFilter, intlFilter, remoteFilter, searchQuery]);

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

  return (
    <div className="relative h-full">
      {/* top fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-card to-transparent z-10" />

      {/* scroll container */}
      <div
        id="portal-scroll-container"
        className="h-full overflow-y-auto thin-scrollbar overscroll-contain"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 min-h-full">

            {/* sidebar filters */}
            <aside className="sticky top-0 h-screen hidden md:flex flex-col justify-center overflow-hidden">
              {/* top fade inside sidebar */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-80 bg-linear-to-b from-card to-transparent z-10" />

              <div className="space-y-8 text-right py-12 overflow-y-auto thin-scrollbar max-h-[calc(100vh-8rem)]">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Portal Type</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["All", ...types] as FilterType[]).map((f) => (
                      <div
                        key={f}
                        onClick={() => setTypeFilter(f)}
                        className={`cursor-pointer transition-colors ${typeFilter === f ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {f === "All" ? "All Types" : f}
                      </div>
                    ))}
                  </div>
                </div>
                {/* region filter */}
                {regions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Region</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {["All", ...regions].map((r) => (
                        <div
                          key={r}
                          onClick={() => setRegionFilter(r)}
                          className={`cursor-pointer transition-colors ${regionFilter === r ? "text-primary font-medium" : "hover:text-foreground"
                            }`}
                        >
                          {r === "All" ? "All Regions" : r}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">International</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["All", "Yes", "No"] as FilterInternational[]).map((f) => (
                      <div
                        key={f}
                        onClick={() => setIntlFilter(f)}
                        className={`cursor-pointer transition-colors ${intlFilter === f ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Remote Friendly</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {(["All", "Yes", "No"] as FilterRemote[]).map((f) => (
                      <div
                        key={f}
                        onClick={() => setRemoteFilter(f)}
                        className={`cursor-pointer transition-colors ${remoteFilter === f ? "text-primary font-medium" : "hover:text-foreground"
                          }`}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* bottom fade inside sidebar */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 bg-linear-to-t from-card to-transparent z-10" />
            </aside>

            {/* content column */}
            <div className="space-y-4 pb-48 pt-8">
              {/* sticky title row with search */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Job portals</h2>
                  <div className="flex-1 ml-6">
                    <SearchBar
                      query={searchQuery}
                      onQueryChange={setSearchQuery}
                      onRandom={() => {
                        const pool = filtered;
                        if (pool.length === 0) return;
                        const pick = pool[Math.floor(Math.random() * pool.length)];
                        window.open(pick.url, "_blank");
                      }}
                    />
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium">No portals match your filters</p>
                </div>
              ) : (
                filtered.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block w-full rounded-xl border border-border/40 px-4 py-4 transition-all backdrop-blur-md hover:bg-white/50 dark:hover:bg-zinc-900/30 hover:shadow-sm hover:border-zinc-200/60 dark:hover:border-zinc-800/60 mb-2"
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
