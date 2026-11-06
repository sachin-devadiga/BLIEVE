"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { siteData } from "@/data/siteData";
import AnimatedSection from "@/components/AnimatedSection";
import ProgramCard from "@/components/ProgramCard";
import GlowCard from "@/components/GlowCard";

const categories = [
  { key: "all", label: "All Programs" },
  { key: "learning", label: "Learning" },
  { key: "competition", label: "Competitions" },
  { key: "community", label: "Community" },
  { key: "support", label: "Support" },
];

export default function ProgramsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return siteData.programs.filter((program) => {
      const matchesCategory =
        activeCategory === "all" || program.category === activeCategory;
      const matchesQuery =
        !q ||
        program.title.toLowerCase().includes(q) ||
        program.description.toLowerCase().includes(q) ||
        program.for.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const hasActiveFilters = activeCategory !== "all" || query.trim() !== "";

  const clearFilters = () => {
    setActiveCategory("all");
    setQuery("");
  };

  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Programs &amp; Activities
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Structured Pathways for Every Founder
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                One ecosystem. Fourteen ways in &mdash; across learning,
                competitions, support and community. Every BLIEVE programme
                exists to move a student one step further along the journey
                from belief to building.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section
        className="py-20 bg-white dark:bg-[#0F0F1A]"
        aria-labelledby="programmes-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="programmes-heading" className="sr-only">
            All programmes
          </h2>

          <AnimatedSection>
            <div className="mb-6">
              <label
                htmlFor="program-search"
                className="block text-sm font-medium text-navy dark:text-white mb-2"
              >
                Search programmes
              </label>
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light"
                  aria-hidden="true"
                />
                <input
                  id="program-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, description or audience…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange/40"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-white/10 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  aria-pressed={activeCategory === cat.key}
                  className={`px-5 py-2.5 min-h-11 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.key
                      ? "bg-orange text-white shadow-lg shadow-orange/20"
                      : "bg-gray-100 dark:bg-white/5 text-text-grey dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <p
              aria-live="polite"
              className="mt-4 text-sm text-text-grey dark:text-gray-400"
            >
              Showing {filtered.length} of {siteData.programs.length}{" "}
              programmes
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-3 inline-flex items-center gap-1 min-h-11 text-orange font-medium hover:text-orange-dark transition-colors"
                >
                  <X size={14} aria-hidden="true" />
                  Clear filters
                </button>
              )}
            </p>
          </AnimatedSection>

          {filtered.length === 0 ? (
            <AnimatedSection>
              <div className="mt-12 text-center py-16 px-6 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <SearchX
                  size={36}
                  className="mx-auto text-orange mb-4"
                  aria-hidden="true"
                />
                <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">
                  No programmes match your search
                </h3>
                <p className="text-text-grey dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  Try a different keyword, or clear the filters to see all 14
                  programmes.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-11 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-light transition-colors"
                >
                  <X size={16} aria-hidden="true" />
                  Clear filters
                </button>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
              >
                {filtered.map((program, i) => (
                  <AnimatedSection key={program.id} delay={i * 0.08}>
                    <GlowCard>
                      <ProgramCard program={program} />
                    </GlowCard>
                  </AnimatedSection>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
