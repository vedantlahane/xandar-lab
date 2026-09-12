"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, Sun, Moon, User, ChevronUp, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getAvatarGradientClass, getDefaultAvatarGradient } from "@/components/auth/AvatarCustomizer";
import { cn } from "@/lib/utils";

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

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Close drawer immediately on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const currentNav =
    NAV.find((item) =>
      item.href === "/lab"
        ? pathname === "/lab"
        : pathname.startsWith(item.href)
    ) || NAV[0];

  const avatarGradient = user
    ? getAvatarGradientClass(user.avatarGradient || getDefaultAvatarGradient(user.username))
    : "";

  const toggleTheme = () => {
    if (theme === "dark" || resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <>
      {/* Floating Bottom Dock */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-3 left-3 right-3 z-40 max-w-sm mx-auto pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-2xl nav-blur-surface-capsule border border-border/40 shadow-xl">
          {/* Active Route & Menu Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-muted/40 active:bg-muted/60 transition-colors"
          >
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full bg-gradient-to-r shrink-0 animate-pulse",
                currentNav.hoverGradient
              )}
            />
            <span className="text-sm font-semibold text-foreground tracking-tight">
              {currentNav.label}
            </span>
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
          </button>

          {/* Quick Actions (Theme & Profile) */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Toggle Theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-700" />
              )}
            </button>

            {/* Profile Avatar / Sign In */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  router.push("/lab/profile");
                } else {
                  openLoginModal();
                }
              }}
              className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-border/50 overflow-hidden hover:ring-primary/40 transition-all"
              title={isAuthenticated ? user?.username : "Sign in"}
            >
              {isAuthenticated && user?.username ? (
                <div
                  className={cn(
                    "h-full w-full flex items-center justify-center bg-gradient-to-br text-[11px] font-bold text-white uppercase",
                    avatarGradient
                  )}
                >
                  {user.username.charAt(0)}
                </div>
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            {/* Sheet Container with Progressive Blur */}
            <motion.div
              initial={{ y: "100%", opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-sm rounded-3xl nav-blur-surface-capsule border border-border/50 shadow-2xl p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Navigate Lab
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Grid */}
              <div className="grid grid-cols-2 gap-1.5 py-1">
                {NAV.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/lab" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs"
                          : "text-foreground/80 hover:text-foreground hover:bg-muted/40 active:bg-muted/60"
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          isActive
                            ? "bg-primary"
                            : cn("bg-muted-foreground/40 bg-gradient-to-r", item.hoverGradient)
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Profile Bar within Sheet */}
              <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white uppercase bg-gradient-to-br shrink-0",
                          avatarGradient
                        )}
                      >
                        {user.username?.charAt(0)}
                      </div>
                      <span className="truncate font-medium text-foreground">
                        {user.username}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 px-2 py-1 rounded-md transition-colors"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openLoginModal();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors text-center"
                  >
                    Sign In to Xandar
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
