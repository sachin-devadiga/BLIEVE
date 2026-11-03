"use client";

import { useState, useEffect, useCallback } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1">
      <div
        className="h-full bg-gradient-to-r from-orange via-orange-light to-orange transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
