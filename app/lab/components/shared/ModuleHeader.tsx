"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ModeConfig {
  href: string;
  label: string;
  exact?: boolean;
  match?: (pathname: string) => boolean;
}

export interface ModuleHeaderProps {
  modes: ModeConfig[];
  activeLayoutId: string;
  children?: ReactNode;
}

export function ModuleHeader({ modes, activeLayoutId, children }: ModuleHeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "h-12 flex-shrink-0 flex items-center px-6",
        "border-b border-border/40 bg-card/80 backdrop-blur-sm z-50 relative"
      )}
    >
      <div className="flex-1" />

      <nav className="flex items-center gap-1">
        {modes.map((mode) => {
          let isActive = false;
          if (mode.match) {
            isActive = mode.match(pathname);
          } else if (mode.exact) {
            isActive = pathname === mode.href;
          } else {
            isActive = pathname.startsWith(mode.href);
          }

          return (
            <Link
              key={mode.href}
              href={mode.href}
              className={cn(
                "relative px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70"
              )}
            >
              {mode.label}
              {isActive && (
                <motion.div
                  layoutId={activeLayoutId}
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
