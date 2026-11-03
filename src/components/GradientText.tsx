"use client";

import { motion } from "framer-motion";

export default function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-orange via-gold to-orange bg-[length:200%_auto] bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}
