// app/lab/jobs/components/JobCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { JOB_LISTINGS, STATUS_CONFIG, ApplicationStatus, JobType, JobPlatform } from "../data/jobs";
import { Bookmark, Building2, MapPin, ExternalLink, Clock, Briefcase } from "lucide-react";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { useAuth } from "@/components/auth/AuthContext";

interface JobCanvasProps {
    activeJobId: string | null;
    onJobSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterType = "All" | JobType;
type FilterStatus = "All" | "Saved" | "Applied" | "Interviewing";
type FilterRemote = "All" | "Remote" | "On-site";

export default function JobCanvas({
    activeJobId,
    onJobSelect,
}: JobCanvasProps) {
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [remoteFilter, setRemoteFilter] = useState<FilterRemote>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { user, updateUser } = useAuth();

    const savedJobs = useMemo(() => user?.savedJobs || [], [user?.savedJobs]);
    const jobApplications = useMemo(() => user?.jobApplications || {}, [user?.jobApplications]);

    const handleSaveJob = async (jobId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        try {
            const res = await fetch('/api/jobs/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, jobId }),
            });

            const data = await res.json();
            if (res.ok) {
                updateUser({ savedJobs: data.savedJobs });
            }
        } catch (error) {
            console.error('Failed to save job:', error);
        }
    };

    // Filter Logic
    const filteredListings = useMemo(() => {
        return JOB_LISTINGS.map((category) => {
            const filteredJobs = category.jobs.filter((job) => {
                // search query
                if (
                    searchQuery &&
                    !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !job.company.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    return false;
                }

                // Type Filter
                if (typeFilter !== "All" && job.type !== typeFilter) {
                    return false;
                }

                // Status Filter
                if (statusFilter === "Saved" && !savedJobs.includes(job.id)) {
                    return false;
                }
                if (statusFilter === "Applied") {
                    const status = jobApplications[job.id];
                    if (!status || status === 'bookmarked') return false;
                }
                if (statusFilter === "Interviewing") {
                    const status = jobApplications[job.id];
                    if (!status || !['phone-screen', 'technical-interview', 'onsite'].includes(status)) return false;
                }

                // Remote Filter
                if (remoteFilter === "Remote" && !job.remote) {
                    return false;
                }
                if (remoteFilter === "On-site" && job.remote) {
                    return false;
                }

                return true;
            });

            return {
                ...category,
                jobs: filteredJobs,
            };
        }).filter((category) => category.jobs.length > 0);
    }, [typeFilter, statusFilter, remoteFilter, savedJobs, jobApplications, searchQuery]);

    const getStatusBadge = (jobId: string) => {
        const status = jobApplications[jobId] as ApplicationStatus | undefined;
        if (!status || status === 'bookmarked') return null;
        const config = STATUS_CONFIG[status];
        return (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="relative h-full pt-12">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-background to-transparent z-20" />

            <div id="jobs-scroll-container" className="h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 md:px-12 pb-48 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
                        {/* Left Column: Filters (practice-style aside) */}
                        <aside className="sticky top-0 h-screen hidden md:flex flex-col justify-center overflow-hidden">
                            {/* top fade */}
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-80 bg-linear-to-b from-background to-transparent z-10" />

                            <div className="space-y-8 text-right py-12 overflow-y-auto thin-scrollbar max-h-[calc(100vh-8rem)]">
                                {/* Type Filter */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Job Type</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {(["All", "Internship", "Full-time", "Part-time", "Contract"] as FilterType[]).map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => setTypeFilter(filter)}
                                                className={`cursor-pointer transition-colors ${typeFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                                                    }`}
                                            >
                                                {filter === "All" ? "All Types" : filter}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Status</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {(["All", "Saved", "Applied", "Interviewing"] as FilterStatus[]).map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => setStatusFilter(statusFilter === filter ? "All" : filter)}
                                                className={`cursor-pointer transition-colors ${statusFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                                                    }`}
                                            >
                                                {filter}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Remote Filter */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Work Style</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {(["All", "Remote", "On-site"] as FilterRemote[]).map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => setRemoteFilter(remoteFilter === filter ? "All" : filter)}
                                                className={`cursor-pointer transition-colors ${remoteFilter === filter ? "text-primary font-medium" : "hover:text-foreground"
                                                    }`}
                                            >
                                                {filter}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* bottom fade */}
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 bg-linear-to-t from-background to-transparent z-10" />
                        </aside>

                        {/* Right Column: Jobs */}
                        <div className="space-y-3">
                            {/* sticky header with search */}
                            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Jobs</h2>
                                    <div className="flex-1 ml-6">
                                        <SearchBar
                                            query={searchQuery}
                                            onQueryChange={setSearchQuery}
                                            onRandom={(e) => {
                                                const pool = filteredListings.flatMap((c) => c.jobs);
                                                if (pool.length === 0) return;
                                                const pick = pool[Math.floor(Math.random() * pool.length)];
                                                onJobSelect(pick.id, e as unknown as React.MouseEvent);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {filteredListings.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-lg font-medium">No jobs match your filters</p>
                                    <p className="text-sm mt-1">Try adjusting your filters to see more opportunities</p>
                                </div>
                            ) : (
                                filteredListings.map((category) => (
                                    <section
                                        key={category.categoryName}
                                        id={category.categoryName}
                                        data-category
                                        data-category-title={category.categoryName}
                                        className="space-y-5"
                                    >
                                        <div className="sticky top-0 z-10 bg-background/95 py-4 backdrop-blur">
                                            <h2 className="text-lg font-semibold">{category.categoryName}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {category.jobs.length} {category.jobs.length === 1 ? 'opportunity' : 'opportunities'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            {category.jobs.map((job) => {
                                                const isActive = activeJobId === job.id;
                                                const isSaved = savedJobs.includes(job.id);
                                                return (
                                                    <button
                                                        key={job.id}
                                                        onClick={(e) => onJobSelect(job.id, e)}
                                                        className={`group relative w-full border-b border-border/40 px-4 py-4 text-left transition-all hover:bg-gradient-to-r hover:from-transparent hover:to-accent/40 ${isActive ? "bg-accent/50" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-2 flex-1">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className={`text-sm font-medium transition-colors ${isActive
                                                                        ? "text-primary"
                                                                        : "text-foreground group-hover:text-primary"
                                                                        }`}>
                                                                        {job.title}
                                                                    </span>
                                                                    {getStatusBadge(job.id)}
                                                                </div>

                                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                        <Building2 className="h-3 w-3" />
                                                                        {job.company}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="h-3 w-3" />
                                                                        {job.location}
                                                                    </span>
                                                                    {job.remote && (
                                                                        <span className="text-emerald-500 font-medium">Remote</span>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
                                                                    <span className="px-1.5 py-0.5 rounded bg-muted">
                                                                        {job.type}
                                                                    </span>
                                                                    <span className="text-muted-foreground/70">
                                                                        via {job.platform}
                                                                    </span>
                                                                    {job.tags?.slice(0, 2).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="text-muted-foreground/50"
                                                                        >
                                                                            • {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Hover Actions */}
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <div
                                                                    role="button"
                                                                    onClick={(e) => handleSaveJob(job.id, e)}
                                                                    className={`rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors ${isSaved
                                                                        ? 'text-amber-500'
                                                                        : 'text-muted-foreground hover:text-foreground'
                                                                        }`}
                                                                    title={isSaved ? "Remove from saved" : "Save job"}
                                                                >
                                                                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                                                                </div>
                                                                <a
                                                                    href={job.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="rounded-md p-1.5 hover:bg-background hover:shadow-sm transition-colors text-muted-foreground hover:text-primary"
                                                                    title="Open job posting"
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
        </div>
    );
}
