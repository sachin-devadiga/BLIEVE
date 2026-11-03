"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function Particle({ delay, left, top }: { delay: number; left: string; top: string }) {
  return (
    <div
      className="absolute bg-orange/30 rounded-full animate-pulse"
      style={{ left, top, animationDelay: `${delay}s`, width: "3px", height: "3px" }}
    />
  );
}

const orbitItems = [
  { icon: "💡", label: "Ideas", angle: 0 },
  { icon: "🚀", label: "Launch", angle: 60 },
  { icon: "📈", label: "Growth", angle: 120 },
  { icon: "🤝", label: "Team", angle: 180 },
  { icon: "💰", label: "Funding", angle: 240 },
  { icon: "🏆", label: "Success", angle: 300 },
];

export default function HeroOrbit() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) return null;

  const particles = Array.from({ length: 30 }, (_, i) => ({
    left: `${seededRandom(i * 7 + 1) * 100}%`,
    top: `${seededRandom(i * 13 + 3) * 100}%`,
    delay: i * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <Particle key={i} delay={p.delay} left={p.left} top={p.top} />
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px]">
        <motion.div
          className="absolute inset-0 border border-orange/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-[60px] border border-orange/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange/5 rounded-full blur-3xl" />

        {orbitItems.map((item) => {
          const radius = 220;
          const rad = (item.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <motion.div
              key={item.label}
              className="absolute top-1/2 left-1/2"
              style={{ x: x - 24, y: y - 24 }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="w-12 h-12 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center text-lg border border-orange/20 hover:border-orange/50 transition-colors"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                title={item.label}
              >
                {item.icon}
              </motion.div>
            </motion.div>
          );
        })}

        {[0, 120, 240].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 220;
          const y = Math.sin(rad) * 220;
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange rounded-full"
              style={{ x: x - 4, y: y - 4 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
            />
          );
        })}
      </div>
    </div>
  );
}
