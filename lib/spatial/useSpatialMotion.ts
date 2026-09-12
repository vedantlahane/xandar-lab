// lib/spatial/useSpatialMotion.ts

"use client";

import { useEffect, useState } from "react";
import { SPATIAL_EASING, DURATION_SPATIAL, DURATION_MICRO, DURATION_MAJOR } from "./constants";
import type { Transition } from "framer-motion";

export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: reduce)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(motionMq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionMq.addEventListener("change", handler);
    return () => motionMq.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

export function useSpatialTransitions() {
  const reducedMotion = usePrefersReducedMotion();

  const spatialTransition: Transition = reducedMotion
    ? { duration: 0.01 }
    : {
        duration: DURATION_SPATIAL,
        ease: SPATIAL_EASING,
      };

  const microTransition: Transition = reducedMotion
    ? { duration: 0.01 }
    : {
        duration: DURATION_MICRO,
        ease: SPATIAL_EASING,
      };

  const majorTransition: Transition = reducedMotion
    ? { duration: 0.01 }
    : {
        duration: DURATION_MAJOR,
        ease: SPATIAL_EASING,
      };

  return {
    reducedMotion,
    spatialTransition,
    microTransition,
    majorTransition,
  };
}
