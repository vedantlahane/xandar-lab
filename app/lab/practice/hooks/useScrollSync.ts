// app/lab/practice/hooks/useScrollSync.ts
"use client"
import { useEffect, useState } from "react";

export function useScrollSync() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById("problem-scroll-container");
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-topic]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTopic(entry.target.id);
          }
        });
      },
      {
        root: container,
        threshold: 0.4,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return { activeTopic };
}
