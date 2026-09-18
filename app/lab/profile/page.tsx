// app/lab/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Loader2, Check, AlertTriangle, Eye, EyeOff,
    Github, Globe, Twitter, ExternalLink, Shield,
    Edit3, KeyRound, Laptop, Trash2, Sparkles,
    Lock, Layers, Activity, LogOut, Share2,
    Calendar, CheckCircle2, Bookmark, Flame
} from "lucide-react";
import { StatsDashboard } from "./components/StatsDashboard";
import { UserContributions } from "./components/UserContributions";
import { AdminUsersManager } from "./components/AdminUsersManager";
import { SessionsManager } from "@/components/auth/SessionsManager";
import { AvatarCustomizer, getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { cn } from "@/lib/utils";

const smoothSpring = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const,
        },
    },
};

function LoadingDots() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

interface ProfileData {
    username: string;
    email?: string;
    bio?: string;
    avatarGradient?: string;
    githubUrl?: string;
    websiteUrl?: string;
    twitterHandle?: string;
    savedProblems: string[];
    completedProblems: string[];
    savedJobs: string[];
    jobApplications: Record<string, string>;
    isProfilePublic: boolean;
    followers: string[];
    following: string[];
    reputationScore: number;
    sharingPreferences: {
        autoShareCompletedProblems: boolean;
        autoShareHackathonResults: boolean;
    };
    createdAt: string;
    lastLoginAt?: string;
    hasPassword: boolean;
    role: "user" | "pro" | "contributor" | "moderator" | "admin";
    contributions?: {
        notes: number;
        experiments: number;
        ideas: number;
    };
}

type TabType = "contributions" | "stats" | "profile" | "security" | "admin" | "danger";

export default function ProfilePage() {
    const { user, isLoading, isAuthenticated, logout, updateUser } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>(() => {
        if (typeof window !== "undefined") {
            const tabParam = new URLSearchParams(window.location.search).get("tab");
            if (tabParam && ["contributions", "stats", "profile", "security", "admin", "danger"].includes(tabParam)) {
                return tabParam as TabType;
            }
        }
        return "contributions";
    });

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Profile form state
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");
    const [isProfilePublic, setIsProfilePublic] = useState(false);
    const [autoShareCompleted, setAutoShareCompleted] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState("");

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Delete account state
    const [deleteConfirmUsername, setDeleteConfirmUsername] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // Modal state for avatar customization
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/lab?mode=login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Fetch profile data
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/auth/profile", {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    const u: ProfileData = data.user;
                    setProfile(u);
                    setEmail(u.email || "");
                    setBio(u.bio || "");
                    setGithubUrl(u.githubUrl || "");
                    setWebsiteUrl(u.websiteUrl || "");
                    setTwitterHandle(u.twitterHandle || "");
                    setIsProfilePublic(Boolean(u.isProfilePublic));
                    setAutoShareCompleted(Boolean(u.sharingPreferences?.autoShareCompletedProblems));
                } else {
                    console.error("Profile API returned not ok:", res.status);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setFetchingProfile(false);
            }
        }

        if (isAuthenticated) {
            fetchProfile();
        } else {
            setFetchingProfile(false);
        }
    }, [isAuthenticated]);

    if (isLoading || fetchingProfile) {
        return <LoadingDots />;
    }

    if (!isAuthenticated || !profile) {
        return null;
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileSaving(true);
        setProfileError("");
        setProfileSuccess(false);

        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    bio,
                    githubUrl,
                    websiteUrl,
                    twitterHandle,
                    isProfilePublic,
                    sharingPreferences: {
                        autoShareCompletedProblems: autoShareCompleted,
                        autoShareHackathonResults: false,
                    },
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update profile");
            }

            const data = await res.json();
            setProfile(data.user);
            updateUser({
                email: data.user.email,
                bio: data.user.bio,
                githubUrl: data.user.githubUrl,
                websiteUrl: data.user.websiteUrl,
                twitterHandle: data.user.twitterHandle,
                isProfilePublic: data.user.isProfilePublic,
            });
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err: any) {
            setProfileError(err.message);
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordSaving(true);
        setPasswordError("");
        setPasswordSuccess(false);

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            setPasswordSaving(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            setPasswordSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to change password");
            }

            setPasswordSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setProfile((prev) => (prev ? { ...prev, hasPassword: true } : null));
            updateUser({ hasPassword: true });
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err: any) {
            setPasswordError(err.message);
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeleting(true);
        setDeleteError("");

        try {
            const res = await fetch("/api/auth/account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    confirmUsername: deleteConfirmUsername,
                    password: deletePassword,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete account");
            }

            await logout();
            router.push("/lab");
        } catch (err: any) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isAdmin = profile.role === "admin" || user?.role === "admin";

    const tabs: { id: TabType; label: string; icon: any; badge?: number | string; adminOnly?: boolean }[] = [
        { id: "contributions", label: "Contributions", icon: Layers, badge: (profile.contributions?.notes || 0) + (profile.contributions?.experiments || 0) + (profile.contributions?.ideas || 0) },
        { id: "stats", label: "Analytics & Streaks", icon: Activity },
        { id: "profile", label: "Edit Profile", icon: Edit3 },
        { id: "security", label: "Security & Sessions", icon: KeyRound },
        ...(isAdmin ? [{ id: "admin" as TabType, label: "Admin & Roles", icon: Shield, adminOnly: true }] : []),
        { id: "danger", label: "Danger Zone", icon: Trash2 },
    ];

    const cleanGithub = profile.githubUrl?.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    const cleanTwitter = profile.twitterHandle?.replace(/^@/, "");

    return (
        <div className="relative flex min-h-screen text-foreground bg-background overflow-hidden">
            {/* Subtle noise texture overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="flex-1 overflow-y-auto pb-32">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6 sm:space-y-8"
                    >
                        {/* Hero Showcase Card */}
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 sm:p-8 shadow-sm"
                        >
                            {/* Decorative background glow */}
                            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                <div className="flex items-start gap-4 sm:gap-5">
                                    {/* Avatar with click to customize */}
                                    <div className="relative group shrink-0">
                                        <div
                                            className={cn(
                                                "h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl font-black text-white uppercase shadow-md transition-transform group-hover:scale-105 duration-200",
                                                getAvatarGradientClass(
                                                    profile.avatarGradient || getDefaultAvatarGradient(profile.username)
                                                )
                                            )}
                                        >
                                            {profile.username.charAt(0)}
                                        </div>
                                        <button
                                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                            className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm hover:scale-110 transition-all"
                                            title="Customize Avatar"
                                        >
                                            <Sparkles className="h-3 w-3 text-primary" />
                                        </button>
                                    </div>

                                    {/* User Details */}
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                                @{profile.username}
                                            </h1>
                                            <RoleBadge role={profile.role || user?.role} size="md" showMember={true} />

                                            {profile.isProfilePublic ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <Globe className="h-2.5 w-2.5" /> Public
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                                    <Lock className="h-2.5 w-2.5" /> Private
                                                </span>
                                            )}
                                        </div>

                                        {profile.bio ? (
                                            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
                                                "{profile.bio}"
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground/60 italic">
                                                No bio written yet. Click 'Edit Profile' to introduce yourself.
                                            </p>
                                        )}

                                        {/* Developer Social Links */}
                                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 text-muted-foreground/60">
                                                <Calendar className="h-3 w-3" />
                                                Joined {formatDate(profile.createdAt)}
                                            </span>

                                            {cleanGithub && (
                                                <a
                                                    href={`https://github.com/${cleanGithub}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
                                                >
                                                    <Github className="h-3 w-3" />
                                                    {cleanGithub}
                                                </a>
                                            )}

                                            {profile.websiteUrl && (
                                                <a
                                                    href={profile.websiteUrl.startsWith("http") ? profile.websiteUrl : `https://${profile.websiteUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                    Portfolio
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </a>
                                            )}

                                            {cleanTwitter && (
                                                <a
                                                    href={`https://x.com/${cleanTwitter}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
                                                >
                                                    <Twitter className="h-3 w-3" />
                                                    @{cleanTwitter}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveTab("profile")}
                                        className="h-8 text-xs gap-1.5 flex-1 sm:flex-none border-border/80"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        Edit Profile
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-1 sm:flex-none"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        Logout
                                    </Button>
                                </div>
                            </div>

                            {/* Avatar Picker Drawer/Box when toggled */}
                            {showAvatarPicker && (
                                <div className="mt-6 pt-5 border-t border-border/60">
                                    <h4 className="text-xs font-semibold mb-3 text-foreground flex items-center justify-between">
                                        <span>Choose Your Gradient Avatar</span>
                                        <button
                                            onClick={() => setShowAvatarPicker(false)}
                                            className="text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            Done
                                        </button>
                                    </h4>
                                    <AvatarCustomizer
                                        username={profile.username}
                                        currentGradient={profile.avatarGradient}
                                        onSave={async (gradientId) => {
                                            const res = await fetch("/api/auth/profile", {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                credentials: "include",
                                                body: JSON.stringify({ avatarGradient: gradientId }),
                                            });
                                            if (res.ok) {
                                                setProfile((prev) => (prev ? { ...prev, avatarGradient: gradientId } : null));
                                                updateUser({ avatarGradient: gradientId });
                                                setShowAvatarPicker(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Stats Summary Strip */}
                            <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 sm:grid-cols-5 gap-3">
                                <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                    <p className="text-lg sm:text-xl font-bold text-violet-500">
                                        {profile.contributions?.notes || 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Notes</p>
                                </div>

                                <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                    <p className="text-lg sm:text-xl font-bold text-rose-500">
                                        {profile.contributions?.experiments || 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Experiments</p>
                                </div>

                                <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                    <p className="text-lg sm:text-xl font-bold text-amber-500">
                                        {profile.contributions?.ideas || 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Ideas</p>
                                </div>

                                <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                    <p className="text-lg sm:text-xl font-bold text-emerald-500">
                                        {profile.completedProblems?.length || 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Solved</p>
                                </div>

                                <div className="col-span-2 sm:col-span-1 rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
                                    <p className="text-lg sm:text-xl font-bold text-primary">
                                        {profile.reputationScore || 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Reputation</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Tabs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-1 border-b border-border/60 overflow-x-auto no-scrollbar"
                        >
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "relative flex items-center gap-2 px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                                            isActive
                                                ? "text-foreground font-semibold"
                                                : "text-muted-foreground hover:text-foreground",
                                            tab.id === "danger" && "hover:text-destructive",
                                            tab.adminOnly && "text-red-500/90 hover:text-red-500 font-semibold"
                                        )}
                                    >
                                        <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground/70", tab.adminOnly && "text-red-500")} />
                                        <span>{tab.label}</span>

                                        {tab.badge !== undefined && typeof tab.badge === "number" && tab.badge > 0 && (
                                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                                                {tab.badge}
                                            </span>
                                        )}

                                        {isActive && (
                                            <motion.div
                                                layoutId="profileActiveTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                transition={smoothSpring}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>

                        {/* Tab Contents */}
                        <AnimatePresence mode="wait">
                            {/* 1. Contributions */}
                            {activeTab === "contributions" && (
                                <motion.div
                                    key="contributions"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <UserContributions initialCounts={profile.contributions} />
                                </motion.div>
                            )}

                            {/* 2. Analytics */}
                            {activeTab === "stats" && (
                                <motion.div
                                    key="stats"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <StatsDashboard />
                                </motion.div>
                            )}

                            {/* 3. Profile Settings */}
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6 max-w-2xl"
                                >
                                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                                        {/* Bio */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    About You / Bio
                                                </label>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {bio.length}/200
                                                </span>
                                            </div>
                                            <textarea
                                                placeholder="Tell the engineering community what you're building or researching..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                maxLength={200}
                                                rows={3}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-card/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Email Address
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="developer@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-10 text-sm bg-card/40"
                                            />
                                            <p className="text-[11px] text-muted-foreground">
                                                Used for security updates and recovery notifications.
                                            </p>
                                        </div>

                                        {/* Developer Links */}
                                        <div className="space-y-3 pt-2">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Developer Links & Socials
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                                        <Github className="h-3.5 w-3.5 text-muted-foreground" />
                                                        GitHub Username
                                                    </label>
                                                    <Input
                                                        placeholder="e.g. torvalds"
                                                        value={githubUrl}
                                                        onChange={(e) => setGithubUrl(e.target.value)}
                                                        className="h-9 text-xs bg-card/40"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                                        <Twitter className="h-3.5 w-3.5 text-muted-foreground" />
                                                        Twitter / X Handle
                                                    </label>
                                                    <Input
                                                        placeholder="e.g. username"
                                                        value={twitterHandle}
                                                        onChange={(e) => setTwitterHandle(e.target.value)}
                                                        className="h-9 text-xs bg-card/40"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Portfolio / Website URL
                                                </label>
                                                <Input
                                                    placeholder="https://yourportfolio.dev"
                                                    value={websiteUrl}
                                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                                    className="h-9 text-xs bg-card/40"
                                                />
                                            </div>
                                        </div>

                                        {/* Privacy & Sharing */}
                                        <div className="space-y-3 pt-3 border-t border-border/60">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Privacy & Community
                                            </h3>

                                            <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40 cursor-pointer hover:bg-card/70 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isProfilePublic}
                                                    onChange={(e) => setIsProfilePublic(e.target.checked)}
                                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                                                />
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                        <Globe className="h-3.5 w-3.5 text-emerald-500" />
                                                        Public Developer Profile
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Allow other community members to view your public notes, experiments, and reputation score.
                                                    </p>
                                                </div>
                                            </label>

                                            <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40 cursor-pointer hover:bg-card/70 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={autoShareCompleted}
                                                    onChange={(e) => setAutoShareCompleted(e.target.checked)}
                                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                                                />
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                                        Auto-Share Completed Practice Problems
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Post an achievement note to the community feed whenever you complete a practice problem.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        {profileError && (
                                            <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                {profileError}
                                            </p>
                                        )}

                                        {profileSuccess && (
                                            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                                                <Check className="h-3.5 w-3.5" />
                                                Profile preferences updated successfully
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            className="h-10 px-5 text-xs font-semibold gap-1.5"
                                            disabled={profileSaving}
                                        >
                                            {profileSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                            Save Profile Changes
                                        </Button>
                                    </form>

                                    {/* Role & System Access Card */}
                                    <div className="rounded-2xl border border-border/60 bg-muted/20 backdrop-blur-sm p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                                    Role & System Access
                                                </h3>
                                            </div>
                                            <RoleBadge role={profile.role || user?.role} size="md" showMember={true} />
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {isAdmin ? (
                                                <span>You hold <strong>Administrator</strong> privileges across Xandar Lab. You can manage users, assign community roles, curate seed content, and edit or moderate any note, experiment, or community submission.</span>
                                            ) : profile.role === "moderator" ? (
                                                <span>You hold <strong>Moderator</strong> privileges. You can edit community tags, review flagged submissions, curate content, and moderate community discussions.</span>
                                            ) : profile.role === "contributor" ? (
                                                <span>You are a <strong>Verified Contributor</strong>. You can publish public notes, create experiments, and participate in community research projects.</span>
                                            ) : (
                                                <span>You are a registered <strong>Community Member</strong>. You have full access to solve problems, save personal notes, run lab experiments, and propose new ideas.</span>
                                            )}
                                        </p>
                                        {isAdmin && (
                                            <div className="pt-1">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setActiveTab("admin")}
                                                    className="text-xs font-semibold border-red-500/30 text-red-500 hover:bg-red-500/10 gap-1.5 h-8"
                                                >
                                                    <Shield className="h-3.5 w-3.5 text-red-500" />
                                                    Open Admin & Roles Management
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* 4. Security & Sessions */}
                            {activeTab === "security" && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-8 max-w-2xl"
                                >
                                    {/* Change Password Form */}
                                    <div className="rounded-xl border border-border/60 bg-card/40 p-5 sm:p-6 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <KeyRound className="h-4 w-4 text-primary" />
                                            <h3 className="text-sm font-semibold text-foreground">
                                                {profile.hasPassword ? "Change Password" : "Set Account Password"}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {profile.hasPassword
                                                ? "You currently have a password enabled. Enter your existing password to set a new one."
                                                : "Secure your account with a direct password."}
                                        </p>

                                        <form onSubmit={handlePasswordChange} className="space-y-3.5 pt-1">
                                            {profile.hasPassword && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-foreground">Current Password</label>
                                                    <div className="relative">
                                                        <Input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            required
                                                            className="h-9 text-xs pr-9 bg-card/40"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-foreground">New Password</label>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                        className="h-9 text-xs pr-9 bg-card/40"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">Minimum 6 characters</p>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="h-9 text-xs bg-card/40"
                                                />
                                            </div>

                                            {passwordError && (
                                                <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                                    <AlertTriangle className="h-3.5 w-3.5" />
                                                    {passwordError}
                                                </p>
                                            )}

                                            {passwordSuccess && (
                                                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                                                    <Check className="h-3.5 w-3.5" />
                                                    {profile.hasPassword ? "Password changed successfully" : "Password set successfully"}
                                                </p>
                                            )}

                                            <Button type="submit" size="sm" className="h-9 text-xs" disabled={passwordSaving}>
                                                {passwordSaving && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                                                {profile.hasPassword ? "Update Password" : "Set Password"}
                                            </Button>
                                        </form>
                                    </div>

                                    {/* Sessions Manager */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Laptop className="h-4 w-4 text-primary" />
                                            <h3 className="text-sm font-semibold text-foreground">Active Browser Sessions</h3>
                                        </div>
                                        <SessionsManager />
                                    </div>
                                </motion.div>
                            )}

                            {/* 5. Admin Panel */}
                            {activeTab === "admin" && isAdmin && (
                                <motion.div
                                    key="admin"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AdminUsersManager />
                                </motion.div>
                            )}

                            {/* 6. Danger Zone */}
                            {activeTab === "danger" && (
                                <motion.div
                                    key="danger"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="max-w-2xl"
                                >
                                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                            <div>
                                                <h3 className="font-semibold text-destructive">Delete Account Permanently</h3>
                                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                    Once you delete your account, all your personal notes, practice stats, bookmarks, and sessions will be permanently purged. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleDeleteAccount} className="space-y-3.5 pt-2">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-foreground">
                                                    Type your username to confirm: <span className="font-mono text-destructive font-bold">{profile.username}</span>
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your username"
                                                    value={deleteConfirmUsername}
                                                    onChange={(e) => setDeleteConfirmUsername(e.target.value)}
                                                    required
                                                    className="h-9 text-xs bg-background/50 border-destructive/30 focus-visible:border-destructive"
                                                />
                                            </div>

                                            {profile.hasPassword && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-foreground">Your Password</label>
                                                    <div className="relative">
                                                        <Input
                                                            type={showDeletePassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                            required
                                                            className="h-9 text-xs pr-9 bg-background/50 border-destructive/30"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            {showDeletePassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {deleteError && (
                                                <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                                    <AlertTriangle className="h-3.5 w-3.5" />
                                                    {deleteError}
                                                </p>
                                            )}

                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                size="sm"
                                                className="h-9 text-xs font-semibold"
                                                disabled={deleting || deleteConfirmUsername !== profile.username}
                                            >
                                                {deleting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                                                Delete My Account Permanently
                                            </Button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
