"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { SPATIAL_EASING, DURATION_MICRO } from "@/lib/spatial/constants";

export default function IdeasTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden min-h-0"
      initial={{ opacity: 0.9, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION_MICRO, ease: SPATIAL_EASING }}
    >
      {children}
    </motion.div>
  );
}
