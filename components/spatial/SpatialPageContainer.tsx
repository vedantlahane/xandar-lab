// components/spatial/SpatialPageContainer.tsx

"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { CONTINUITY_EASING, DURATION_PAGE } from "@/lib/spatial/constants";
import { usePrefersReducedMotion } from "@/lib/spatial/useSpatialMotion";

interface SpatialPageContainerProps {
  children: ReactNode;
}

export function SpatialPageContainer({ children }: SpatialPageContainerProps) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        key={pathname}
        initial={
          reducedMotion
            ? { opacity: 1 }
            : {
                opacity: 0,
                y: 4,
                scale: 0.996,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: reducedMotion ? 0.05 : DURATION_PAGE,
          ease: CONTINUITY_EASING,
        }}
        className="h-full w-full flex flex-col will-change-[opacity,transform]"
      >
        {children}
      </motion.div>
    </div>
  );
}
