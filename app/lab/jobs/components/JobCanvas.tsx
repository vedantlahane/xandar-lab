// app/lab/jobs/components/JobCanvas.tsx
"use client";

import { useState, useMemo } from "react";
import { JOB_LISTINGS, STATUS_CONFIG, ApplicationStatus, JobType, JobPlatform } from "../data/jobs";
import {
    Bookmark, Building2, MapPin, ExternalLink, Clock, Briefcase,
    Layers, GraduationCap, Clock4, FileSignature, Handshake,
    Wifi, Building, Globe,
    Linkedin, Code2, Github,
    ArrowUpDown, ChevronDown, ChevronUp,
    Tag, DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/app/lab/practice/components/browse/SearchBar";
import { useAuth } from "@/components/auth/AuthContext";

interface JobCanvasProps {
    activeJobId: string | null;
    onJobSelect: (id: string, event: React.MouseEvent) => void;
}

type FilterType = "All" | JobType;
type FilterStatus = "All" | "Saved" | "Applied" | "Interviewing";
type FilterRemote = "All" | "Remote" | "On-site";
type FilterPlatform = "All" | string;
type SortOption = "Company" | "Title" | "Salary";

// ── Type filter config ──────────────────────────────────────────────────
const TYPE_ITEMS: { value: FilterType; label: string; icon: typeof Layers; dotColor: string }[] = [
    { value: "All", label: "All Types", icon: Layers, dotColor: "bg-muted-foreground" },
    { value: "Internship", label: "Internship", icon: GraduationCap, dotColor: "bg-blue-500" },
    { value: "Full-time", label: "Full-time", icon: Briefcase, dotColor: "bg-green-500" },
    { value: "Part-time", label: "Part-time", icon: Clock4, dotColor: "bg-yellow-500" },
    { value: "Contract", label: "Contract", icon: FileSignature, dotColor: "bg-orange-500" },
    { value: "Freelance", label: "Freelance", icon: Handshake, dotColor: "bg-pink-500" },
];

// ── Work style filter config ────────────────────────────────────────────
const REMOTE_ITEMS: { value: FilterRemote; label: string; dotColor: string; activeColor: string }[] = [
    { value: "Remote", label: "Remote", dotColor: "bg-emerald-500", activeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
    { value: "On-site", label: "On-site", dotColor: "bg-blue-500", activeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
];

// ── Status filter config ────────────────────────────────────────────────
const STATUS_ITEMS: { value: FilterStatus; label: string }[] = [
    { value: "Saved", label: "Saved" },
    { value: "Applied", label: "Applied" },
    { value: "Interviewing", label: "Interviewing" },
];

// ── Sort config ─────────────────────────────────────────────────────────
const SORT_ITEMS: { value: SortOption; label: string }[] = [
    { value: "Company", label: "Company" },
    { value: "Title", label: "Title" },
    { value: "Salary", label: "Salary" },
];

// Extract unique platforms
const ALL_PLATFORMS = Array.from(
    new Set(JOB_LISTINGS.flatMap(c => c.jobs.map(j => j.platform)))
).sort();

export default function JobCanvas({
    activeJobId,
    onJobSelect,
}: JobCanvasProps) {
    const [typeFilter, setTypeFilter] = useState<FilterType>("All");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [remoteFilter, setRemoteFilter] = useState<FilterRemote>("All");
    const [platformFilter, setPlatformFilter] = useState<FilterPlatform>("All");
    const [sortOption, setSortOption] = useState<SortOption>("Company");
    const [sortDesc, setSortDesc] = useState(false);
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
                if (
                    searchQuery &&
                    !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !job.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !job.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                ) {
                    return false;
                }

                if (typeFilter !== "All" && job.type !== typeFilter) return false;
                if (platformFilter !== "All" && job.platform !== platformFilter) return false;
                if (remoteFilter === "Remote" && !job.remote) return false;
                if (remoteFilter === "On-site" && job.remote) return false;

                if (statusFilter === "Saved" && !savedJobs.includes(job.id)) return false;
                if (statusFilter === "Applied") {
                    const status = jobApplications[job.id];
                    if (!status || status === 'bookmarked') return false;
                }
                if (statusFilter === "Interviewing") {
                    const status = jobApplications[job.id];
                    if (!status || !['phone-screen', 'technical-interview', 'onsite'].includes(status)) return false;
                }

                return true;
            });

            // Sort
            const sorted = [...filteredJobs].sort((a, b) => {
                let cmp = 0;
                if (sortOption === "Company") cmp = a.company.localeCompare(b.company);
                else if (sortOption === "Title") cmp = a.title.localeCompare(b.title);
                else if (sortOption === "Salary") {
                    const extractNum = (s: string | undefined) => parseInt(s?.replace(/[^0-9]/g, '') || '0');
                    cmp = extractNum(a.salary) - extractNum(b.salary);
                }
                return sortDesc ? -cmp : cmp;
            });

            return { ...category, jobs: sorted };
        }).filter((category) => category.jobs.length > 0);
    }, [typeFilter, statusFilter, remoteFilter, platformFilter, savedJobs, jobApplications, searchQuery, sortOption, sortDesc]);

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

    // Stats
    const allJobs = JOB_LISTINGS.flatMap(c => c.jobs);
    const totalCount = allJobs.length;
    const remoteCount = allJobs.filter(j => j.remote).length;
    const internCount = allJobs.filter(j => j.type === 'Internship').length;

    return (
        <div className="relative h-full">
            {/* Top Fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

            <div id="jobs-scroll-container" className="h-full overflow-y-auto thin-scrollbar overscroll-contain">
                <div className="max-w-7xl mx-auto px-8 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 min-h-full">

                        {/* ── Left column: Filters — sticky, vertically centered ── */}
                        <aside className="relative sticky top-0 h-screen hidden md:flex flex-col justify-center">
                            <div className="space-y-4 py-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-4rem)]">

                                {/* Stats card */}
                                <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-3.5 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Briefcase className="h-4 w-4 text-cyan-500" />
                                        Overview
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-foreground">{totalCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Total</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-emerald-500">{remoteCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Remote</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-blue-500">{internCount}</div>
                                            <div className="text-[10px] text-muted-foreground">Interns</div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Job Type ── */}
                                <div className="space-y-0.5">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Job Type
                                    </h3>
                                    {TYPE_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = typeFilter === item.value;
                                        return (
                                            <button
                                                key={item.value}
                                                onClick={() => setTypeFilter(item.value)}
                                                className={cn(
                                                    "flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-3.5 w-3.5 shrink-0",
                                                        isActive ? "text-primary" : "text-muted-foreground/50",
                                                    )}
                                                />
                                                <span className="truncate">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* ── Work Style ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Work Style
                                    </h3>
                                    <div className="flex gap-1.5">
                                        {REMOTE_ITEMS.map((item) => {
                                            const isActive = remoteFilter === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setRemoteFilter(isActive ? "All" : item.value)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-1 justify-center",
                                                        isActive
                                                            ? item.activeColor
                                                            : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", item.dotColor)} />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Status ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5">
                                        Application
                                    </h3>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {STATUS_ITEMS.map((item) => {
                                            const isActive = statusFilter === item.value;
                                            return (
                                                <button
                                                    key={item.value}
                                                    onClick={() => setStatusFilter(isActive ? "All" : item.value)}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Platform ── */}
                                <div className="space-y-1">
                                    <h3 className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-widest px-2 mb-1.5 flex items-center gap-1.5">
                                        <Globe className="h-3 w-3" />
                                        Platform
                                    </h3>
                                    <div className="flex gap-1 flex-wrap">
                                        {ALL_PLATFORMS.map((platform) => {
                                            const isActive = platformFilter === platform;
                                            return (
                                                <button
                                                    key={platform}
                                                    onClick={() => setPlatformFilter(isActive ? "All" : platform)}
                                                    className={cn(
                                                        "px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all",
                                                        isActive
                                                            ? "bg-primary/10 text-primary border-primary/30"
                                                            : "border-transparent text-muted-foreground/70 hover:bg-muted/30 hover:text-foreground",
                                                    )}
                                                >
                                                    {platform}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Sort ── */}
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

                        {/* ── Right column: Search + Jobs ── */}
                        <div className="space-y-4 pb-48 pt-8">
                            {/* Sticky search bar */}
                            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
                                <SearchBar
                                    query={searchQuery}
                                    onQueryChange={setSearchQuery}
                                    placeholder="Search jobs, companies, tags..."
                                />
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
                                        <div className="sticky top-16 z-10 bg-background/95 py-4 backdrop-blur">
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
                                                        className={`group relative w-full rounded-xl border border-border/40 px-4 py-4 text-left transition-all backdrop-blur-md hover:bg-white/50 dark:hover:bg-zinc-900/30 hover:shadow-sm hover:border-zinc-200/60 dark:hover:border-zinc-800/60 mb-2 ${isActive ? "bg-white/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm" : ""}`}
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
                                                                    {job.salary && (
                                                                        <span className="text-emerald-500/70 flex items-center gap-0.5">
                                                                            • <DollarSign className="h-3 w-3" /> {job.salary}
                                                                        </span>
                                                                    )}
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
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent z-10" />
        </div>
    );
}
