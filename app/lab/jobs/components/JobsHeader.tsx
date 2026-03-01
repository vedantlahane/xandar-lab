"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModeConfig {
  href: string;
  label: string;
  exact?: boolean;
}

const MODES: ModeConfig[] = [
  { href: "/lab/jobs", label: "Jobs", exact: true },
  { href: "/lab/jobs/portals", label: "Portals" },
];

export function JobsHeader({ children }: { children?: ReactNode }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "h-12 flex-shrink-0 flex items-center px-6",
        "border-b border-border/40 bg-card/80 backdrop-blur-sm",
      )}
    >
      <div className="flex-1" />

      <nav className="flex items-center gap-1">
        {MODES.map((mode) => {
          const isActive = mode.exact
            ? pathname === mode.href
            : pathname.startsWith(mode.href);

          return (
            <Link
              key={mode.href}
              href={mode.href}
              className={cn(
                "relative px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70",
              )}
            >
              {mode.label}
              {isActive && (
                <motion.div
                  layoutId="activeJobsMode"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 28,
                    mass: 0.6,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1 flex justify-end">
        {children && (
          <div className="flex items-center gap-3">{children}</div>
        )}
      </div>
    </header>
  );
}
