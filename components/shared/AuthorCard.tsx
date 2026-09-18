// components/shared/AuthorCard.tsx
"use client";

import Link from "next/link";
import { RoleBadge } from "./RoleBadge";
import { getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface AuthorCardProps {
    username?: string;
    role?: string;
    avatarGradient?: string;
    date?: string | Date;
    className?: string;
    size?: "sm" | "md";
}

export function AuthorCard({
    username = "Anonymous",
    role = "user",
    avatarGradient,
    date,
    className,
    size = "md",
}: AuthorCardProps) {
    const isCuratedSeed = username === "Xandar Curated" || username === "Xandar Lab";
    const gradient = avatarGradient || getDefaultAvatarGradient(username);
    const gradientClass = getAvatarGradientClass(gradient);

    const formattedDate = date
        ? typeof date === "string"
            ? date
            : new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    const avatarSize = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";

    return (
        <div className={cn("inline-flex items-center gap-2.5", className)}>
            {/* Avatar */}
            <div
                className={cn(
                    "rounded-full flex items-center justify-center font-bold text-white uppercase shrink-0 shadow-xs ring-1 ring-border/50",
                    avatarSize,
                    `bg-gradient-to-br ${gradientClass}`
                )}
            >
                {username.charAt(0)}
            </div>

            {/* Author info */}
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-foreground tracking-tight truncate hover:text-primary transition-colors">
                        @{username}
                    </span>
                    <RoleBadge role={role} size="sm" showMember={true} />
                </div>

                {formattedDate && (
                    <span className="text-[11px] text-muted-foreground/70 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {formattedDate}
                    </span>
                )}
            </div>
        </div>
    );
}
