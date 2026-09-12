// app/lab/components/LabSidebar.tsx

"use client";

import type { Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const smoothSpring = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.6,
} satisfies Transition;

const NAV = [
  { href: "/lab", label: "Lab", hoverGradient: "from-blue-500 via-indigo-500 to-purple-500" },
  { href: "/lab/practice", label: "Practice", hoverGradient: "from-emerald-500 via-teal-500 to-cyan-500" },
  { href: "/lab/hackathons", label: "Hackathons", hoverGradient: "from-orange-500 via-amber-500 to-yellow-500" },
  { href: "/lab/jobs", label: "Jobs", hoverGradient: "from-pink-500 via-rose-500 to-red-500" },
  { href: "/lab/notes", label: "Notes", hoverGradient: "from-violet-500 via-fuchsia-500 to-pink-500" },
  { href: "/lab/docs", label: "Docs", hoverGradient: "from-cyan-500 via-blue-500 to-indigo-500" },
  { href: "/lab/experiments", label: "Experiments", hoverGradient: "from-fuchsia-500 via-purple-500 to-rose-500" },
  { href: "/lab/ideas", label: "Ideas", hoverGradient: "from-teal-500 via-emerald-500 to-cyan-500" },
];

export default function LabSidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchMovedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // Close immediately when pathname changes without lag
  useEffect(() => {
    setIsOpen(false);
    setIsPeeking(false);
  }, [pathname]);

  const isExpanded = isHovered || isOpen || isPeeking;

  const handleTouchStart = (e: React.TouchEvent) => {
    // If tapping an active link, do not intercept
    if ((e.target as HTMLElement).closest("a")) return;
    touchMovedRef.current = false;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      if (!touchMovedRef.current) {
        setIsPeeking(true);
      }
    }, 180);
  };

  const handleTouchMove = () => {
    touchMovedRef.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // If tapping an active link, do not intercept
    if ((e.target as HTMLElement).closest("a")) return;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isPeeking) {
      setIsPeeking(false);
    } else if (!touchMovedRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleTouchCancel = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsPeeking(false);
  };

  return (
    <>
      {/* Invisible Outside Tap Backdrop to cleanly dismiss without GPU lag or darkening */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Navigation */}
      <aside className="fixed left-0 top-0 z-40 flex h-full items-center justify-start pl-2 sm:pl-4 pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto relative flex flex-col gap-1.5 transition-all duration-200 select-none",
            isExpanded
              ? "py-2.5 pl-3 pr-5 rounded-2xl nav-blur-surface-left shadow-2xl min-w-[150px]"
              : "py-2.5 pr-3 bg-transparent"
          )}
          onMouseEnter={() => !isTouch && setIsHovered(true)}
          onMouseLeave={() => !isTouch && setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          {NAV.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/lab" && pathname.startsWith(item.href));

            const isBig = index % 4 === 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setIsOpen(false);
                  setIsPeeking(false);
                }}
                className={cn(
                  "group flex items-center gap-2.5 py-0.5 rounded-md transition-colors",
                  isExpanded && "px-1.5 hover:bg-muted/40 active:bg-muted/60"
                )}
              >
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-primary"
                      : cn("bg-muted-foreground/30 group-hover:bg-gradient-to-r group-hover:animate-gradient", item.hoverGradient)
                  )}
                  style={{
                    width: isExpanded ? 6 : isBig ? 24 : 12,
                    height: isExpanded ? 6 : 4,
                    opacity: isExpanded ? 0 : 1,
                  }}
                />

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={cn(
                        "whitespace-nowrap text-sm font-medium overflow-hidden transition-colors",
                        isActive
                          ? "text-foreground"
                          : cn("text-muted-foreground group-hover:bg-gradient-to-r group-hover:animate-gradient group-hover:bg-clip-text group-hover:text-transparent", item.hoverGradient)
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
