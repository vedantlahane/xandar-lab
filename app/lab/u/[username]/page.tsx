"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Loader2, Lock, Github, Globe, Twitter,
    Calendar, Users, UserPlus, UserMinus, Shield,
    FileText, Beaker, Lightbulb
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PublicProfilePage() {
    const { username } = useParams() as { username: string };
    const { isAuthenticated, user: currentUser } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [contributions, setContributions] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`/api/users/${username}`, {
                    credentials: "include"
                });
                if (!res.ok) {
                    if (res.status === 404) throw new Error("User not found");
                    throw new Error("Failed to load profile");
                }
                const data = await res.json();
                setProfile(data.user);
                setContributions(data.contributions);
                setIsFollowing(data.isFollowing);
                setFollowersCount(data.user.followers?.length || 0);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [username]);

    const handleFollow = async () => {
        if (!isAuthenticated) {
            router.push(`/lab?mode=login&callbackUrl=/lab/u/${username}`);
            return;
        }

        setFollowLoading(true);
        try {
            const res = await fetch(`/api/users/${username}/follow`, {
                method: "POST",
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.followed);
                setFollowersCount(prev => data.followed ? prev + 1 : prev - 1);
            }
        } catch (err) {
            console.error("Failed to toggle follow", err);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <h1 className="text-2xl font-bold text-foreground">User Not Found</h1>
                    <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
                    <Button variant="outline" onClick={() => router.push("/lab")} className="mt-2">
                        Return to Lab
                    </Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    const isSelf = currentUser?.username?.toLowerCase() === username.toLowerCase();
    const cleanGithub = profile.githubUrl?.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    const cleanTwitter = profile.twitterHandle?.replace(/^@/, "");

    return (
        <div className="relative flex min-h-screen text-foreground bg-background overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-32">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8">
                        
                        {/* Profile Card */}
                        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                <div className="flex items-start gap-4 sm:gap-5">
                                    <div
                                        className={`h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl font-black text-white uppercase shadow-md shrink-0 ${getAvatarGradientClass(profile.avatarGradient || getDefaultAvatarGradient(profile.username))}`}
                                    >
                                        {profile.username.charAt(0)}
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                                @{profile.username}
                                            </h1>
                                            <RoleBadge role={profile.role} size="md" showMember={true} />
                                        </div>

                                        {profile.bio ? (
                                            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
                                                "{profile.bio}"
                                            </p>
                                        ) : profile.isProfilePublic && (
                                            <p className="text-xs text-muted-foreground/60 italic">
                                                No bio provided.
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 font-medium">
                                                <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
                                                <span className="text-foreground">{followersCount}</span> Followers
                                            </span>
                                            {profile.following && (
                                                <span className="flex items-center gap-1 font-medium">
                                                    <span className="text-foreground">{profile.following.length}</span> Following
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 text-muted-foreground/60">
                                                <Calendar className="h-3 w-3" />
                                                Joined {formatDate(profile.createdAt)}
                                            </span>

                                            {cleanGithub && (
                                                <a href={`https://github.com/${cleanGithub}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                                                    <Github className="h-3 w-3" /> {cleanGithub}
                                                </a>
                                            )}
                                            {profile.websiteUrl && (
                                                <a href={profile.websiteUrl.startsWith("http") ? profile.websiteUrl : `https://${profile.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                                                    <Globe className="h-3 w-3" /> Portfolio
                                                </a>
                                            )}
                                            {cleanTwitter && (
                                                <a href={`https://x.com/${cleanTwitter}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                                                    <Twitter className="h-3 w-3" /> @{cleanTwitter}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {!isSelf && profile.isProfilePublic && (
                                    <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                                        <Button
                                            variant={isFollowing ? "outline" : "default"}
                                            size="sm"
                                            onClick={handleFollow}
                                            disabled={followLoading}
                                            className={`h-9 w-full sm:w-32 font-semibold text-xs transition-all ${isFollowing ? "border-border/80 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10" : ""}`}
                                        >
                                            {followLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isFollowing ? (
                                                <><UserMinus className="h-3.5 w-3.5 mr-1.5" /> Unfollow</>
                                            ) : (
                                                <><UserPlus className="h-3.5 w-3.5 mr-1.5" /> Follow</>
                                            )}
                                        </Button>
                                    </div>
                                )}
                                {isSelf && (
                                    <div className="flex sm:flex-col items-center w-full sm:w-auto shrink-0">
                                        <Button variant="outline" size="sm" onClick={() => router.push("/lab/profile")} className="h-9 w-full sm:w-32 font-semibold text-xs border-border/80">
                                            Edit Profile
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {profile.isProfilePublic && (
                                <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div className="rounded-xl border border-border/40 p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-foreground">{profile.reputationScore || 0}</p>
                                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Reputation</p>
                                    </div>
                                    <div className="rounded-xl border border-border/40 p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-foreground">{contributions?.notes?.length || 0}</p>
                                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Public Notes</p>
                                    </div>
                                    <div className="rounded-xl border border-border/40 p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-foreground">{contributions?.experiments?.length || 0}</p>
                                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Experiments</p>
                                    </div>
                                    <div className="rounded-xl border border-border/40 p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-foreground">{contributions?.ideas?.length || 0}</p>
                                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Ideas</p>
                                    </div>
                                    <div className="rounded-xl border border-border/40 p-3 text-center">
                                        <p className="text-lg sm:text-xl font-bold text-foreground">{contributions?.docs?.length || 0}</p>
                                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Documents</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {!profile.isProfilePublic ? (
                            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/60 rounded-xl bg-muted/10">
                                <Lock className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold text-foreground">This profile is private</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                    @{profile.username} has chosen not to make their stats and contributions publicly visible.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" /> Recent Public Contributions
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Notes */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                                            <FileText className="h-4 w-4" /> Notes
                                        </h3>
                                        <div className="space-y-2">
                                            {contributions?.notes?.length === 0 ? (
                                                <div className="p-4 rounded-xl border border-border/40 bg-card/20 text-xs text-muted-foreground text-center italic">No public notes yet.</div>
                                            ) : (
                                                contributions?.notes?.map((note: any) => (
                                                    <Link key={note._id} href={`/lab/notes?id=${note._id}`} className="group block p-3.5 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 transition-all">
                                                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{note.title}</p>
                                                        <p className="text-[11px] text-muted-foreground mt-1">{note.category}</p>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Experiments */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                                            <Beaker className="h-4 w-4" /> Experiments
                                        </h3>
                                        <div className="space-y-2">
                                            {contributions?.experiments?.length === 0 ? (
                                                <div className="p-4 rounded-xl border border-border/40 bg-card/20 text-xs text-muted-foreground text-center italic">No public experiments yet.</div>
                                            ) : (
                                                contributions?.experiments?.map((exp: any) => (
                                                    <Link key={exp._id} href={`/lab/experiments?id=${exp._id}`} className="group block p-3.5 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 transition-all">
                                                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{exp.title}</p>
                                                        <p className="text-[11px] text-muted-foreground mt-1 capitalize">{exp.status}</p>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                                            <FileText className="h-4 w-4" /> Documents
                                        </h3>
                                        <div className="space-y-2">
                                            {contributions?.docs?.length === 0 ? (
                                                <div className="p-4 rounded-xl border border-border/40 bg-card/20 text-xs text-muted-foreground text-center italic">No public documents yet.</div>
                                            ) : (
                                                contributions?.docs?.map((doc: any) => (
                                                    <Link key={doc._id} href={`/lab/docs?id=${doc._id}`} className="group block p-3.5 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 transition-all">
                                                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{doc.title}</p>
                                                        <p className="text-[11px] text-muted-foreground mt-1 capitalize">{doc.category || "General"}</p>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Sparkles icon definition as it might not be imported above
function Sparkles(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
