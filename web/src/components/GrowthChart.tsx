"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function GrowthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const bars = [
    { label: "2022", value: 20, ventures: 3 },
    { label: "2023", value: 45, ventures: 8 },
    { label: "2024", value: 65, ventures: 15 },
    { label: "2025", value: 80, ventures: 20 },
    { label: "2026", value: 100, ventures: 24 },
  ];

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-end gap-3 h-48 md:h-64">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className="text-xs font-bold text-orange"
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.15 + 0.8 }}
            >
              {bar.ventures}
            </motion.div>
            <motion.div
              className="w-full rounded-t-lg bg-gradient-to-t from-orange to-orange-light relative overflow-hidden"
              initial={{ height: 0 }}
              animate={visible ? { height: `${bar.value}%` } : {}}
              transition={{
                duration: 1,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={visible ? { x: ["-100%", "200%"] } : {}}
                transition={{
                  duration: 2,
                  delay: i * 0.15 + 1,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              />
            </motion.div>
            <span className="text-xs text-text-light font-medium">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-orange/20 text-center">
        <p className="text-xs text-text-light">
          Ventures launched per year —{" "}
          <span className="text-orange font-semibold">8x growth in 4 years</span>
        </p>
      </div>
    </div>
  );
}
