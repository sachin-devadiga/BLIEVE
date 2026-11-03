"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Search,
  Users,
  Hammer,
  FlaskConical,
  Rocket,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const nodes = [
  { id: "idea", label: "Idea", x: 10, y: 50, Icon: Lightbulb },
  { id: "research", label: "Research", x: 25, y: 30, Icon: Search },
  { id: "team", label: "Team", x: 25, y: 70, Icon: Users },
  { id: "build", label: "Build", x: 45, y: 45, Icon: Hammer },
  { id: "test", label: "Test", x: 60, y: 25, Icon: FlaskConical },
  { id: "launch", label: "Launch", x: 75, y: 50, Icon: Rocket },
  { id: "scale", label: "Scale", x: 90, y: 35, Icon: TrendingUp },
  { id: "fund", label: "Fund", x: 90, y: 65, Icon: DollarSign },
];

const connections = [
  ["idea", "research"],
  ["idea", "team"],
  ["research", "build"],
  ["team", "build"],
  ["build", "test"],
  ["test", "launch"],
  ["launch", "scale"],
  ["launch", "fund"],
];

export default function NetworkMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getNodePos = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div ref={ref} className="relative w-full h-72 md:h-96">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {connections.map(([from, to], i) => {
          const a = getNodePos(from);
          const b = getNodePos(to);
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(232, 124, 30, 0.2)"
              strokeWidth="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={visible ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute flex flex-col items-center"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={visible ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: i * 0.15 }}
        >
          <motion.div
            className="w-10 h-10 md:w-14 md:h-14 bg-navy dark:bg-white/10 rounded-full flex items-center justify-center border-2 border-orange/30 shadow-lg shadow-orange/10 cursor-default"
            whileHover={{ scale: 1.2, borderColor: "rgba(232,124,30,1)" }}
          >
            <node.Icon
              size={18}
              className="text-orange md:w-6 md:h-6"
            />
          </motion.div>
          <span className="mt-1 text-[10px] md:text-xs font-semibold text-navy dark:text-white whitespace-nowrap">
            {node.label}
          </span>
        </motion.div>
      ))}

      {visible && (
        <motion.div
          className="absolute w-2 h-2 bg-orange rounded-full shadow-lg shadow-orange/50"
          animate={{
            left: ["10%", "25%", "45%", "60%", "75%", "90%"],
            top: ["50%", "30%", "45%", "25%", "50%", "35%"],
            scale: [1, 1.2, 1, 1.2, 1, 0.8],
            opacity: [1, 0.8, 1, 0.8, 1, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
