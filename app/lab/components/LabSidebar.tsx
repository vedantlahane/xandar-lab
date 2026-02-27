// app/lab/components/LabSidebar.tsx

"use client";

import type { Transition } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";

const smoothSpring = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.6,
} satisfies Transition;

const NAV = [
  { href: "/lab", label: "Lab" },
  { href: "/lab/practice", label: "Practice" },
  { href: "/lab/hackathons", label: "Hackathons" },
  { href: "/lab/jobs", label: "Jobs" },
  { href: "/lab/notes", label: "Notes" },
  { href: "/lab/docs", label: "Docs" },
  { href: "/lab/experiments", label: "Experiments" },
];

export default function LabSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleNavigation = (href: string) => {
    if (href === "/lab") {
      router.push(href);
      return;
    }

    if (!isAuthenticated) {
      router.push("/lab?mode=login");
      return;
    }

    router.push(href);
  };

  const isProfileActive = pathname === "/lab/profile";

  return (
    <>
      {/* Main Navigation */}
      <aside className="fixed left-0 top-0 z-40 flex h-full items-center justify-start pl-4 pointer-events-none">
        <motion.div
          layout
          transition={{ layout: smoothSpring }}
          className="pointer-events-auto relative flex flex-col gap-3 py-4 pr-4"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {NAV.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/lab" && pathname.startsWith(item.href));

            const isBig = index % 4 === 0;

            return (
              <motion.button
                layout="position"
                transition={{ layout: smoothSpring }}
                key={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
                className="group flex items-center gap-3"
              >
                <motion.div
                  layout
                  transition={smoothSpring}
                  className={cn(
                    "h-1 rounded-full transition-colors duration-300",
                    isActive
                      ? "bg-primary"
                      : "bg-muted-foreground/30 group-hover:bg-primary/50"
                  )}
                  animate={{
                    width: isHovered ? 6 : isBig ? 24 : 12,
                    height: isHovered ? 6 : 4,
                    opacity: isHovered ? 0 : 1,
                  }}
                />

                <AnimatePresence initial={false}>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, x: -10 }}
                      animate={{ opacity: 1, width: "auto", x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -10 }}
                      transition={smoothSpring}
                      className={cn(
                        "whitespace-nowrap text-sm font-medium overflow-hidden",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      </aside>

      {/* Profile Section - Bottom Left */}
      <aside className="fixed left-0 bottom-0 z-40 flex items-end justify-start pl-4 pb-4 pointer-events-none">
        <motion.div
          layout
          transition={{ layout: smoothSpring }}
          className="pointer-events-auto"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <ProfileDropdown isExpanded={isHovered} />
        </motion.div>
      </aside>
    </>
  );
}
