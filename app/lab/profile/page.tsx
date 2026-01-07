"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";

// Smooth spring config for organic motion
const smoothSpring = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8,
};

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

// Animated loading dots
function LoadingDots() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
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
    email: string;
    bio: string;
    savedProblems: string[];
    completedProblems: string[];
    createdAt: string;
    lastLoginAt: string;
    hasPassword: boolean;
}

type TabType = "profile" | "password" | "danger";

export default function ProfilePage() {
    const { user, isLoading, isAuthenticated, logout, updateUser } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>("profile");
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Profile form state
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
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
                    setProfile(data.user);
                    setEmail(data.user.email || "");
                    setBio(data.user.bio || "");
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setFetchingProfile(false);
            }
        }

        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    // Handle profile update
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
                body: JSON.stringify({ email, bio }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update profile");
            }

            const data = await res.json();
            setProfile(data.user);
            updateUser({ email: data.user.email, bio: data.user.bio });
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err: any) {
            setProfileError(err.message);
        } finally {
            setProfileSaving(false);
        }
    };

    // Handle password change
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
            setProfile(prev => prev ? { ...prev, hasPassword: true } : null);
            updateUser({ hasPassword: true });
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err: any) {
            setPasswordError(err.message);
        } finally {
            setPasswordSaving(false);
        }
    };

    // Handle account deletion
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

            // Account deleted, redirect to home
            await logout();
            router.push("/lab");
        } catch (err: any) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    // Format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading || fetchingProfile) {
        return <LoadingDots />;
    }

    if (!isAuthenticated || !profile) {
        return null;
    }

    const tabs: { id: TabType; label: string }[] = [
        { id: "profile", label: "Profile" },
        { id: "password", label: "Password" },
        { id: "danger", label: "Danger Zone" },
    ];

    return (
        <div className="relative flex min-h-screen bg-zinc-50 text-zinc-800 dark:bg-black dark:text-zinc-200 overflow-hidden">
            {/* Subtle noise texture overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="flex-1 overflow-auto">
                <div className="mx-auto max-w-2xl px-6 py-12">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Manage your profile and account preferences
                            </p>
                        </motion.div>

                        {/* User Info Card */}
                        <motion.div
                            variants={itemVariants}
                            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 flex items-center justify-center text-2xl font-bold text-white uppercase">
                                    {profile.username.charAt(0)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h2 className="text-xl font-semibold">{profile.username}</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Member since {formatDate(profile.createdAt)}
                                    </p>
                                    {profile.lastLoginAt && (
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                            Last active: {formatDateTime(profile.lastLoginAt)}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                    className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                                >
                                    Logout
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50 p-4 text-center">
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {profile.savedProblems?.length || 0}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Saved Problems</p>
                                </div>
                                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50 p-4 text-center">
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {profile.completedProblems?.length || 0}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Completed</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tabs */}
                        <motion.div variants={itemVariants} className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                                            ? "text-zinc-900 dark:text-zinc-100"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                        } ${tab.id === "danger" ? "text-destructive hover:text-destructive" : ""}`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100"
                                            transition={smoothSpring}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                Email
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11"
                                            />
                                            <p className="text-xs text-zinc-400">
                                                Optional. Used for account recovery.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                Bio
                                            </label>
                                            <textarea
                                                placeholder="Tell us about yourself..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                maxLength={200}
                                                rows={3}
                                                className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                                            />
                                            <p className="text-xs text-zinc-400 text-right">
                                                {bio.length}/200
                                            </p>
                                        </div>

                                        {profileError && (
                                            <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                {profileError}
                                            </p>
                                        )}

                                        {profileSuccess && (
                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                                                <Check className="h-3.5 w-3.5" />
                                                Profile updated successfully
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            className="h-10"
                                            disabled={profileSaving}
                                        >
                                            {profileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === "password" && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50 p-4">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {profile.hasPassword
                                                ? "You have a password set. Enter your current password to change it."
                                                : "You haven't set a password yet. Set one to secure your account."}
                                        </p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        {profile.hasPassword && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                        className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11 pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                    className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-xs text-zinc-400">
                                                Minimum 6 characters
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                Confirm New Password
                                            </label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-500 transition-colors h-11"
                                            />
                                        </div>

                                        {passwordError && (
                                            <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                {passwordError}
                                            </p>
                                        )}

                                        {passwordSuccess && (
                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                                                <Check className="h-3.5 w-3.5" />
                                                {profile.hasPassword ? "Password updated successfully" : "Password set successfully"}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            className="h-10"
                                            disabled={passwordSaving}
                                        >
                                            {passwordSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {profile.hasPassword ? "Change Password" : "Set Password"}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === "danger" && (
                                <motion.div
                                    key="danger"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                            <div>
                                                <h3 className="font-semibold text-destructive">Delete Account</h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                                    Once you delete your account, there is no going back. All your data will be permanently removed.
                                                </p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleDeleteAccount} className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    Type your username to confirm: <span className="font-mono text-destructive">{profile.username}</span>
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your username"
                                                    value={deleteConfirmUsername}
                                                    onChange={(e) => setDeleteConfirmUsername(e.target.value)}
                                                    required
                                                    className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-destructive transition-colors h-11"
                                                />
                                            </div>

                                            {profile.hasPassword && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        Password
                                                    </label>
                                                    <div className="relative">
                                                        <Input
                                                            type={showDeletePassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                            required
                                                            className="bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-destructive transition-colors h-11 pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                                        >
                                                            {showDeletePassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
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
                                                className="h-10"
                                                disabled={deleting || deleteConfirmUsername !== profile.username}
                                            >
                                                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Delete My Account
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
