// components/shared/RoleBadge.tsx
import { Shield, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
    role?: string;
    className?: string;
    showIcon?: boolean;
    size?: "sm" | "md";
}

export function RoleBadge({
    role,
    className,
    showIcon = true,
    size = "md"
}: RoleBadgeProps) {
    if (!role || role === "user") return null;

    const sizeClasses = size === "sm"
        ? "text-[9px] px-1.5 py-0 tracking-tight"
        : "text-[10px] px-2 py-0.5 tracking-wider";

    const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

    switch (role) {
        case "admin":
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-full font-bold uppercase bg-red-500/15 text-red-500 border border-red-500/30",
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
                        "inline-flex items-center gap-1 rounded-full font-bold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30",
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
                        "inline-flex items-center gap-1 rounded-full font-bold uppercase bg-blue-500/15 text-blue-500 border border-blue-500/30",
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
                        "inline-flex items-center gap-1 rounded-full font-bold uppercase bg-purple-500/15 text-purple-500 border border-purple-500/30",
                        sizeClasses,
                        className
                    )}
                    title="Pro Member"
                >
                    {showIcon && <Zap className={iconSize} />}
                    Pro
                </span>
            );
        default:
            return null;
    }
}
