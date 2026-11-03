/**
 * Living "startup & growth" wallpaper for the homepage hero ONLY.
 *
 * Pure CSS + SVG (no JS animation loops, no extra deps), so it stays light:
 *  - drifting tech grid
 *  - ascending growth line with flowing energy + pulsing milestones
 *  - slow-rising glow particles
 *
 * All motion is defined in globals.css and is neutralised by the existing
 * prefers-reduced-motion rule.
 */

import type { CSSProperties } from "react";

const GROWTH_PATH =
  "M0,270 L110,250 L200,258 L300,215 L390,222 L480,170 L560,150 L650,105 L720,80 L800,45";

const MILESTONES = [
  { x: 110, y: 250 },
  { x: 300, y: 215 },
  { x: 480, y: 170 },
  { x: 650, y: 105 },
  { x: 800, y: 45 },
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 6.25 + 3) % 100,
  size: 2 + (i % 3),
  dur: 16 + ((i * 7) % 16),
  delay: (i * 1.7) % 16,
  op: 0.3 + (i % 5) * 0.12,
  warm: i % 2 === 0,
}));

export default function HeroWallpaper() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Drifting tech grid */}
      <div className="hero-grid absolute inset-0" />

      {/* Growth line */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[58%] w-full"
        viewBox="0 0 800 300"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="hw-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E06A20" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#E06A20" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Filled area under the curve */}
        <path
          d={`${GROWTH_PATH} L800,300 L0,300 Z`}
          fill="url(#hw-area)"
        />

        {/* Base ascending line */}
        <path
          d={GROWTH_PATH}
          fill="none"
          stroke="rgba(232,124,30,0.55)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Flowing energy along the line */}
        <path
          d={GROWTH_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="hero-flow"
        />

        {/* Pulsing milestones */}
        {MILESTONES.map((m, i) => (
          <g key={`${m.x}-${m.y}`}>
            <circle
              cx={m.x}
              cy={m.y}
              r="4"
              fill="#E06A20"
              className="hero-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={m.x} cy={m.y} r="2" fill="#fff" />
          </g>
        ))}
      </svg>

      {/* Rising glow particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`hero-particle absolute bottom-0 rounded-full ${
            p.warm ? "bg-orange" : "bg-white"
          }`}
          style={
            {
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.dur}s`,
              animationDelay: `-${p.delay}s`,
              "--op": p.op,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
