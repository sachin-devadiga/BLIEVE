"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm group-hover:shadow-md group-hover:shadow-black/5 dark:group-hover:shadow-black/20 transition-all duration-200 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
