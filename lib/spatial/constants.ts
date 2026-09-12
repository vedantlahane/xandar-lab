// lib/spatial/constants.ts

/**
 * Apple-grade smooth deceleration curve for perceptual continuity.
 * Soft landing with zero overshoot or bouncing.
 */
export const CONTINUITY_EASING = [0.2, 0, 0, 1] as const;
export const CONTINUITY_EASING_CSS = "cubic-bezier(0.2, 0, 0, 1)";

/**
 * Restrained transition durations (in seconds):
 * - Micro (buttons, tabs, indicators): 200–250ms
 * - Page Content In-Place Replacement: 300–350ms
 * - Theme Coordinated Material Transition: 400–480ms
 * - Drawer / Detail Settlement: 400–450ms
 */
export const DURATION_MICRO = 0.22;
export const DURATION_PAGE = 0.32;
export const DURATION_THEME = 0.45;
export const DURATION_DRAWER = 0.42;
