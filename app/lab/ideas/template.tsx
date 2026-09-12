"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
