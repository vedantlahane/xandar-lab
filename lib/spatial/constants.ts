// lib/spatial/constants.ts

/**
 * Canonical vertical hierarchy index for primary modules.
 * Used to determine spatial direction (forward/down vs backward/up)
 * as the user navigates through Xandar-Lab.
 */
export const ROUTE_SPATIAL_INDEX: Record<string, number> = {
  "/lab": 0,
  "/lab/practice": 1,
  "/lab/hackathons": 2,
  "/lab/jobs": 3,
  "/lab/notes": 4,
  "/lab/docs": 5,
  "/lab/experiments": 6,
  "/lab/ideas": 7,
  "/lab/profile": 8,
};

/**
 * Standard cubic-bezier curve tuned for physical, spring-damped surface transitions.
 * High initial velocity with gentle, precise mechanical settling.
 */
export const SPATIAL_EASING = [0.16, 1, 0.3, 1] as const;
export const SPATIAL_EASING_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Physical transition durations (milliseconds) adhering to user guidelines:
 * - Micro: 200-400ms (buttons, icons, indicators)
 * - Standard Spatial: 500-800ms (theme planar sweep, page surface reconfiguration)
 * - Major Transformations: 700-1000ms (drawer expansion from originating element)
 */
export const DURATION_MICRO = 0.28; // 280ms
export const DURATION_SPATIAL = 0.62; // 620ms
export const DURATION_MAJOR = 0.74; // 740ms

export type SpatialDirection = "down" | "up" | "in" | "out" | "same";

export interface SpatialVector {
  direction: SpatialDirection;
  delta: number;
  isSubNav: boolean;
}

/**
 * Calculates the spatial direction and delta between two paths in the application.
 */
export function getSpatialVector(prevPath: string, nextPath: string): SpatialVector {
  if (prevPath === nextPath) {
    return { direction: "same", delta: 0, isSubNav: false };
  }

  // Normalize paths (strip trailing slashes, keep root segment)
  const normPrev = prevPath.replace(/\/$/, "");
  const normNext = nextPath.replace(/\/$/, "");

  // Detect parent <-> child subnavigation (e.g. /lab/practice -> /lab/practice/focus)
  if (normNext.startsWith(normPrev) && normNext !== normPrev) {
    return { direction: "in", delta: 1, isSubNav: true };
  }
  if (normPrev.startsWith(normNext) && normPrev !== normNext) {
    return { direction: "out", delta: -1, isSubNav: true };
  }

  // Base module matching
  const findIndex = (path: string): number => {
    // Exact match first
    if (ROUTE_SPATIAL_INDEX[path] !== undefined) {
      return ROUTE_SPATIAL_INDEX[path];
    }
    // Prefix match (e.g. /lab/practice/interview -> matches /lab/practice)
    const base = Object.keys(ROUTE_SPATIAL_INDEX)
      .filter((k) => k !== "/lab" && path.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    return base ? ROUTE_SPATIAL_INDEX[base] : 0;
  };

  const prevIdx = findIndex(normPrev);
  const nextIdx = findIndex(normNext);
  const delta = nextIdx - prevIdx;

  if (delta > 0) {
    return { direction: "down", delta, isSubNav: false };
  }
  if (delta < 0) {
    return { direction: "up", delta, isSubNav: false };
  }
  return { direction: "same", delta: 0, isSubNav: false };
}
