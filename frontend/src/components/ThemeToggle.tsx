"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

export default function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) return <div className="w-11 h-11" />;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
        onDark
          ? "bg-white/10 hover:bg-white/20"
          : "bg-navy/5 dark:bg-white/10 hover:bg-navy/10 dark:hover:bg-white/20"
      }`}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun size={18} className="text-orange" />
        ) : onDark ? (
          <Moon size={18} className="text-white" />
        ) : (
          <Moon size={18} className="text-navy" />
        )}
      </motion.div>
    </motion.button>
  );
}
