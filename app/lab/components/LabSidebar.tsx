// app/lab/components/LabSidebar.tsx

"use client";

import type { Transition } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

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
  { href: "/ideas", label: "Ideas", hoverGradient: "from-teal-500 via-emerald-500 to-cyan-500" },
];

export default function LabSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();

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
                    "h-1 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-primary"
                      : cn("bg-muted-foreground/30 group-hover:bg-gradient-to-r group-hover:animate-gradient", item.hoverGradient)
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
                        "whitespace-nowrap text-sm font-medium overflow-hidden transition-all duration-300",
                        isActive
                          ? "text-foreground"
                          : cn("text-muted-foreground group-hover:bg-gradient-to-r group-hover:animate-gradient group-hover:bg-clip-text group-hover:text-transparent", item.hoverGradient)
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

    </>
  );
}
