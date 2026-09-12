// lib/spatial/useSpatialMotion.ts

"use client";

import { useEffect, useState } from "react";
import {
  CONTINUITY_EASING,
  DURATION_PAGE,
  DURATION_MICRO,
  DURATION_DRAWER,
} from "./constants";
import type { Transition } from "framer-motion";

export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionMq.addEventListener("change", handler);
    return () => motionMq.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

export function useContinuityTransitions() {
  const reducedMotion = usePrefersReducedMotion();

  const pageTransition: Transition = reducedMotion
    ? { duration: 0.01 }
    : {
        duration: DURATION_PAGE,
        ease: CONTINUITY_EASING,
      };

  const microTransition: Transition = reducedMotion
    ? { duration: 0.01 }
    : {
        duration: DURATION_MICRO,
        ease: CONTINUITY_EASING,
      };

  const drawerTransition: Transition = reducedMotion
    ? { duration: 0.01 }
    : {
        duration: DURATION_DRAWER,
        ease: CONTINUITY_EASING,
      };

  return {
    reducedMotion,
    pageTransition,
    microTransition,
    drawerTransition,
  };
}
