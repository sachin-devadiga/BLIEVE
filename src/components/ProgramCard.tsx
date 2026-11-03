"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Program } from "@/data/types";

const categoryColors: Record<string, string> = {
  learning: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  competition: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  community: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
  support: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
};

const categoryLabels: Record<string, string> = {
  learning: "Learning",
  competition: "Competition",
  community: "Community",
  support: "Support",
};

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center text-orange"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {getIcon(program.icon, { size: 22 })}
        </motion.div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[program.category]}`}
        >
          {categoryLabels[program.category] ?? program.category}
        </span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mb-2">
        {program.title}
      </h3>
      <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
        {program.description}
      </p>
      <div className="pt-4 border-t border-gray-100 dark:border-white/10">
        <p className="text-xs text-text-light mb-3">
          <span className="font-semibold text-navy dark:text-white">For:</span>{" "}
          {program.for}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center text-orange text-sm font-medium hover:text-orange-dark transition-colors group/link"
          aria-label={`Learn more about ${program.title}`}
        >
          Learn more
          <ArrowRight
            size={14}
            className="ml-1 group-hover/link:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
