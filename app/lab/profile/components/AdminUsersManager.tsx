// app/lab/profile/components/AdminUsersManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Shield, Search, Check, AlertTriangle,
    Loader2, Users, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/RoleBadge";
import type { UserRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

interface ManagedUser {
    id: string;
    username: string;
    email?: string;
    role: UserRole;
    reputationScore: number;
    createdAt: string;
}

const ROLES: { value: UserRole; label: string }[] = [
    { value: "user", label: "User (Standard)" },
    { value: "pro", label: "Pro Member" },
    { value: "contributor", label: "Contributor" },
    { value: "moderator", label: "Moderator" },
    { value: "admin", label: "Admin" },
];

export function AdminUsersManager() {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ id: string; success: boolean; message: string } | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (search.trim()) params.set("q", search.trim());

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
                setTotalPages(data.totalPages || 1);
                setTotalUsers(data.total || 0);
            }
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setUpdatingId(userId);
        setFeedback(null);

        try {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to update role");
            }

            // Optimistically update local user role
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );

            setFeedback({ id: userId, success: true, message: `Updated to ${newRole}` });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err: any) {
            setFeedback({ id: userId, success: false, message: err.message || "Failed" });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Shield className="h-4 w-4 text-red-500" />
                        Community User Management
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Manage permissions, promote contributors, and moderate roles across {totalUsers} registered users.
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search username or email..."
                        className="pl-8 h-8 text-xs bg-card/50"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 border rounded-xl bg-card/30">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl bg-card/30 text-muted-foreground text-xs">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No users found matching "{search}"
                </div>
            ) : (
                <div className="rounded-xl border border-border/60 overflow-hidden bg-card/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                                <tr>
                                    <th className="py-2.5 px-3.5">User</th>
                                    <th className="py-2.5 px-3.5">Current Role</th>
                                    <th className="py-2.5 px-3.5">Reputation</th>
                                    <th className="py-2.5 px-3.5">Joined</th>
                                    <th className="py-2.5 px-3.5 text-right">Assign Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {users.map((u) => {
                                    const isUpdating = updatingId === u.id;
                                    const userFeedback = feedback?.id === u.id ? feedback : null;

                                    return (
                                        <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="py-2.5 px-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                        {u.username.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-foreground">
                                                            @{u.username}
                                                        </span>
                                                        {u.email && (
                                                            <p className="text-[11px] text-muted-foreground">
                                                                {u.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                                                <RoleBadge role={u.role} size="sm" />
                                                {(!u.role || u.role === "user") && (
                                                    <span className="text-[11px] text-muted-foreground font-medium">
                                                        Standard User
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-2.5 px-3.5 text-muted-foreground font-medium">
                                                {u.reputationScore || 0} pts
                                            </td>

                                            <td className="py-2.5 px-3.5 text-muted-foreground text-[11px]">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                                            </td>

                                            <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    {userFeedback && (
                                                        <span
                                                            className={cn(
                                                                "text-[10px] font-semibold flex items-center gap-1",
                                                                userFeedback.success ? "text-emerald-500" : "text-destructive"
                                                            )}
                                                        >
                                                            {userFeedback.success ? (
                                                                <Check className="h-3 w-3" />
                                                            ) : (
                                                                <AlertTriangle className="h-3 w-3" />
                                                            )}
                                                            {userFeedback.message}
                                                        </span>
                                                    )}

                                                    {isUpdating ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    ) : (
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) =>
                                                                handleRoleChange(u.id, e.target.value as UserRole)
                                                            }
                                                            className="h-7 px-2 rounded-md border border-input bg-background text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                                                        >
                                                            {ROLES.map((r) => (
                                                                <option key={r.value} value={r.value}>
                                                                    {r.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-2 border-t border-border/40 text-xs text-muted-foreground bg-muted/20">
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="h-6 px-2 text-xs"
                                >
                                    <ChevronLeft className="h-3 w-3" /> Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="h-6 px-2 text-xs"
                                >
                                    Next <ChevronRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
