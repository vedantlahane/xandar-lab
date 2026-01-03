"use client";

import { useState } from "react";
import type { Transition } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { SHEET } from "../data/sheet";
import { useScrollSync } from "../hooks/useScrollSync";
import { cn } from "@/lib/utils";

const smoothSpring = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.6,
} satisfies Transition;

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
    <aside className="fixed right-0 top-0 z-40 flex h-full items-center pr-6 pointer-events-none">
      <motion.div
        layout
        transition={{ layout: smoothSpring }}
        className="pointer-events-auto relative flex flex-col gap-3 py-4"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {SHEET.map((topic, index) => {
          const isActive = activeTopic === topic.topicName;
          const isBig = index % 4 === 0;

          return (
            <motion.button
              key={topic.topicName}
              layout="position"
              transition={{ layout: smoothSpring }}
              onClick={() => scrollToTopic(topic.topicName)}
              className="group flex flex-row-reverse items-center gap-4"
            >
              {/* Indicator */}
              <motion.div
                layout
                transition={smoothSpring}
                className={cn(
                  "h-1 rounded-full transition-colors duration-300",
                  isActive
                    ? "bg-primary"
                    : "bg-muted-foreground/30 group-hover:bg-primary/50"
                )}
                animate={{
                  width: isHovered ? 6 : isBig ? 24 : 12,
                  height: isHovered ? 6 : 4,
                  opacity: isHovered ? 0 : 1,
                }}
              />

              {/* Label (NO layout animation) */}
              <div className=" overflow-hidden">
                <AnimatePresence initial={false}>
                  {isHovered && (
                    <motion.span
                      layout={false}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{
                        type: "tween",
                        duration: 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={cn(
                        "block whitespace-nowrap text-sm font-medium",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {topic.topicName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </aside>
  );
}
