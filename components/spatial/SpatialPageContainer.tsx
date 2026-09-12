// components/spatial/SpatialPageContainer.tsx

"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  getSpatialVector,
  type SpatialDirection,
  SPATIAL_EASING,
  DURATION_SPATIAL,
} from "@/lib/spatial/constants";
import { usePrefersReducedMotion } from "@/lib/spatial/useSpatialMotion";

interface SpatialPageContainerProps {
  children: ReactNode;
}

export function SpatialPageContainer({ children }: SpatialPageContainerProps) {
  const pathname = usePathname();
  const prevPathRef = useRef<string>(pathname);
  const [direction, setDirection] = useState<SpatialDirection>("same");
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      const vector = getSpatialVector(prevPathRef.current, pathname);
      setDirection(vector.direction);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  // Compute spatial transform initial state based on directional physics
  const getInitialState = () => {
    if (reducedMotion || direction === "same") {
      return { opacity: 1 };
    }

    switch (direction) {
      case "down":
        // Navigating downward in hierarchy: surface unfolds downward and forward
        return {
          opacity: 0.88,
          rotateX: -2.2,
          y: 16,
          scale: 0.988,
        };
      case "up":
        // Navigating upward in hierarchy: surface unfolds upward and backward
        return {
          opacity: 0.88,
          rotateX: 2.2,
          y: -16,
          scale: 0.988,
        };
      case "in":
        // Sub-navigation depth zoom into focused workspace
        return {
          opacity: 0.9,
          scale: 0.97,
          y: 6,
        };
      case "out":
        // Returning from focused sub-workspace out to parent module
        return {
          opacity: 0.9,
          scale: 1.02,
          y: -6,
        };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden [perspective:1200px]">
      <motion.div
        key={pathname}
        initial={getInitialState()}
        animate={{
          opacity: 1,
          rotateX: 0,
          y: 0,
          scale: 1,
        }}
        transition={
          reducedMotion
            ? { duration: 0.05 }
            : {
                duration: DURATION_SPATIAL,
                ease: SPATIAL_EASING,
              }
        }
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: direction === "up" ? "50% 100%" : "50% 0%",
        }}
        className="h-full w-full flex flex-col will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
