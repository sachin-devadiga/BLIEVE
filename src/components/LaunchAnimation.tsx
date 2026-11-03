"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export default function LaunchAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

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

  const stars = Array.from({ length: 20 }, (_, i) => ({
    left: `${seededRandom(i * 7 + 1) * 100}%`,
    top: `${seededRandom(i * 13 + 3) * 60}%`,
  }));

  return (
    <div
      ref={ref}
      className="relative w-full h-40 md:h-56 overflow-hidden rounded-2xl bg-navy-dark dark:bg-[#080F24]"
    >
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-orange/20 to-transparent" />

      {mounted &&
        stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: star.left, top: star.top }}
            animate={
              visible
                ? { opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }
                : {}
            }
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}

      {mounted && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-4xl md:text-5xl"
          initial={{ y: 200, x: 0 }}
          animate={
            visible
              ? {
                  y: [200, 100, 20, -60],
                  x: [0, 0, -10, 20],
                  rotate: [0, 0, -5, 5],
                }
              : {}
          }
          transition={{ duration: 3, ease: "easeOut", times: [0, 0.4, 0.7, 1] }}
        >
          🚀
        </motion.div>
      )}

      {visible && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-[40%] w-1 bg-gradient-to-t from-orange via-orange-light to-transparent rounded-full"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: [0, 60, 40], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.5, delay: 0.3 }}
        />
      )}

      {visible &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 w-3 h-3 bg-white/20 rounded-full"
            initial={{ y: 220, x: -6, scale: 0.5, opacity: 0 }}
            animate={{
              y: [220, 240 + i * 10],
              x: [-6 + i * 5, -20 + i * 15],
              scale: [0.5, 1.5 + i * 0.3],
              opacity: [0, 0.4, 0],
            }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
          />
        ))}

      <motion.div
        className="absolute bottom-4 right-4 text-xs text-orange/60 font-medium"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 2.5 }}
      >
        From idea to launch
      </motion.div>
    </div>
  );
}
