"use client";

import type { Transition } from "framer-motion";

const smoothSpring = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.6,
} satisfies Transition;
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { User } from "lucide-react";

const NAV = [
  { href: "/lab", label: "Lab" },
  { href: "/lab/practice", label: "Practice" },
  { href: "/lab/hackathons", label: "Hackathons" },
  { href: "/lab/notes", label: "Notes" },
  { href: "/lab/docs", label: "Docs" },
  { href: "/lab/experiments", label: "Experiments" },
];

export default function LabSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const { isAuthenticated, user, openLoginModal } = useAuth();

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

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      router.push("/lab?mode=login");
      return;
    }
    router.push("/lab/profile");
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

      {/* Profile Button - Bottom Left */}
      <aside className="fixed left-0 bottom-0 z-40 flex items-end justify-start pl-4 pb-4 pointer-events-none">
        <motion.div
          layout
          transition={{ layout: smoothSpring }}
          className="pointer-events-auto"
          onHoverStart={() => setIsProfileHovered(true)}
          onHoverEnd={() => setIsProfileHovered(false)}
        >
          <motion.button
            layout
            transition={smoothSpring}
            onClick={handleProfileClick}
            className={cn(
              "group flex items-center gap-2 rounded-full transition-colors duration-300",
              isProfileActive
                ? "bg-zinc-200 dark:bg-zinc-800"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            )}
            animate={{
              padding: isProfileHovered ? "8px 14px 8px 10px" : "8px",
            }}
          >
            <motion.div
              layout
              transition={smoothSpring}
              className={cn(
                "flex items-center justify-center rounded-full transition-colors duration-300",
                isProfileActive
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : "bg-zinc-200 dark:bg-zinc-800 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700"
              )}
              animate={{
                width: isProfileHovered ? 28 : 32,
                height: isProfileHovered ? 28 : 32,
              }}
            >
              {isAuthenticated && user ? (
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase">
                  {user.username.charAt(0)}
                </span>
              ) : (
                <User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {isProfileHovered && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={smoothSpring}
                  className={cn(
                    "whitespace-nowrap text-sm font-medium overflow-hidden",
                    isProfileActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {isAuthenticated && user ? user.username : "Sign In"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </aside>
    </>
  );
}

