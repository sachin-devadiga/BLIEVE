"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedCounter({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  const numericPart = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.]/g, "");
  const target = parseFloat(numericPart);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <div ref={ref} className="text-center relative group">
      <div className="absolute inset-0 bg-orange/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={visible ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-orange/10 dark:bg-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange/20 transition-colors">
          <div className="text-orange">{icon}</div>
        </div>

        <div className="font-serif text-4xl sm:text-5xl font-bold text-navy dark:text-white mb-2">
          {visible ? (
            <>
              {Math.floor(count)}
              {suffix}
            </>
          ) : (
            "0"
          )}
        </div>

        <div className="text-text-grey dark:text-gray-400 text-sm mb-3">
          {label}
        </div>

        <div className="w-full h-1 bg-navy/10 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange to-orange-light rounded-full"
            initial={{ width: 0 }}
            animate={visible ? { width: "100%" } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
