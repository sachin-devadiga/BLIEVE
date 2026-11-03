"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const numericPart = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseFloat(numericPart);
            const duration = 1500;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setDisplayed(value);
                clearInterval(timer);
              } else {
                setDisplayed(
                  Math.floor(current).toString() + suffix
                );
              }
            }, duration / steps);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericPart, suffix, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-4xl sm:text-5xl font-bold text-orange mb-2">
        {displayed}
      </div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
  );
}
