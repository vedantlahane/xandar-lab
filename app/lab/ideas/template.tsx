"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { CONTINUITY_EASING, DURATION_PAGE } from "@/lib/spatial/constants";

export default function IdeasTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_PAGE, ease: CONTINUITY_EASING }}
    >
      {children}
    </motion.div>
  );
}
