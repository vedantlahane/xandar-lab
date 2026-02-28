// components/auth/hooks/useClickOutside.ts
import { useEffect, RefObject } from "react";

/**
 * Calls `handler` when a click or tap event occurs outside `ref`.
 * Also fires on Escape keydown.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, handler, enabled]);
}
