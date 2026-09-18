// components/shared/RoleBadge.tsx
import { Shield, ShieldCheck, Sparkles, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
    role?: string;
    className?: string;
    showIcon?: boolean;
    size?: "sm" | "md";
    showMember?: boolean;
}

export function RoleBadge({
    role,
    className,
    showIcon = true,
    size = "md",
    showMember = false,
}: RoleBadgeProps) {
    if (!role) return null;

    const sizeClasses = size === "sm"
        ? "text-[9px] px-1 py-0 tracking-tight font-medium"
        : "text-[10px] px-1.5 py-0.5 tracking-wider font-semibold";

    const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

    switch (role) {
        case "admin":
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded uppercase bg-red-500/10 text-red-400 border border-red-500/20",
                        sizeClasses,
                        className
                    )}
                    title="Site Administrator"
                >
                    {showIcon && <Shield className={iconSize} />}
                    Admin
                </span>
            );
        case "moderator":
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        sizeClasses,
                        className
                    )}
                    title="Community Moderator"
                >
                    {showIcon && <ShieldCheck className={iconSize} />}
                    Mod
                </span>
            );
        case "contributor":
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20",
                        sizeClasses,
                        className
                    )}
                    title="Verified Contributor"
                >
                    {showIcon && <Sparkles className={iconSize} />}
                    Contributor
                </span>
            );
        case "pro":
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20",
                        sizeClasses,
                        className
                    )}
                    title="Pro Member"
                >
                    {showIcon && <Zap className={iconSize} />}
                    Pro
                </span>
            );
        case "user":
            if (!showMember) return null;
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded uppercase bg-muted/40 text-muted-foreground/70 border border-border/40 font-normal",
                        sizeClasses,
                        className
                    )}
                    title="Community Member"
                >
                    {showIcon && <User className={iconSize} />}
                    Member
                </span>
            );
        default:
            return null;
    }
}
