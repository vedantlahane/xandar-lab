"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SHEET } from "../data/sheet";
import { useScrollSync } from "../hooks/useScrollSync";
import { cn } from "@/lib/utils";

export default function TopicSidebar() {
  const { activeTopic } = useScrollSync();
  const [isHovered, setIsHovered] = useState(false);

  const scrollToTopic = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex h-full items-center justify-end pr-6">
      <motion.div
        layout="position"
        transition={{
          layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
        className="relative flex flex-col gap-3 py-4 pl-6"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {SHEET.map((topic, index) => {
          const isActive = activeTopic === topic.topicName;
          // Pattern: 1st big (index 0), then 3 shorter, then 5th (index 4) big...
          const isBig = index % 4 === 0;

          return (
            <button
              key={topic.topicName}
              onClick={() => scrollToTopic(topic.topicName)}
              className="group flex flex-row-reverse items-center gap-4"
            >
              {/* The Slash / Indicator */}
              <motion.div
                className={cn(
                  "h-1 rounded-full transition-colors duration-300 ease-out",
                  isActive
                    ? "bg-primary"
                    : "bg-muted-foreground/30 group-hover:bg-primary/50"
                )}
                animate={{
                  width: isHovered ? 4 : isBig ? 24 : 12,
                  height: isHovered ? 4 : 4,
                  opacity: isHovered ? 0 : 1,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* The Label */}
              <AnimatePresence initial={false}>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ 
                      duration: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "whitespace-nowrap text-sm font-medium transition-colors duration-200",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {topic.topicName}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
