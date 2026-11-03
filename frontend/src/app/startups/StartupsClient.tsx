"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteData } from "@/data/siteData";
import { getIcon } from "@/lib/icons";
import AnimatedSection from "@/components/AnimatedSection";
import StartupCard from "@/components/StartupCard";
import GlowCard from "@/components/GlowCard";

// Pipeline stages mirror the Startup["stage"] values in src/data/types.ts.
// These are stages ventures move through — not published venture profiles.
const pipelineStages = [
  { stage: "Idea", note: "Voiced, explored, validated" },
  { stage: "MVP", note: "Prototype in early users' hands" },
  { stage: "Launched", note: "Venture live with first customers" },
  { stage: "Funded", note: "Seed capital secured for growth" },
];

const supportPrograms = siteData.programs.filter(
  (program) => program.category === "support"
);

export default function StartupsClient() {
  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Venture Portfolio
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ventures Born at BLIEVE
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                BLIEVE&apos;s community has 4 ventures in the pipeline. No
                profiles are published yet &mdash; each founder story will
                appear here, with its stage and team, only once the venture is
                ready to be featured publicly.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Portfolio state — siteData.startups is the future data source for
          real venture profiles; it is currently empty by design. */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {siteData.startups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteData.startups.map((startup, i) => (
                <AnimatedSection key={startup.name} delay={i * 0.1}>
                  <GlowCard>
                    <StartupCard startup={startup} />
                  </GlowCard>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-3xl p-10 md:p-14 text-center border border-orange/10">
                <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                  Portfolio
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                  Launching Soon
                </h2>
                <p className="text-text-grey dark:text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
                  We would rather publish nothing than publish fiction. When a
                  venture through BLIEVE is ready to be showcased, its profile
                  &mdash; founders, stage, and story &mdash; will appear right
                  here.
                </p>
                <div className="inline-flex items-baseline gap-3 bg-white dark:bg-white/5 rounded-2xl px-8 py-5 border border-orange/10">
                  <span className="font-serif text-4xl font-bold text-orange">
                    4
                  </span>
                  <span className="text-text-grey dark:text-gray-400 text-sm text-left leading-snug">
                    ventures in
                    <br />
                    the pipeline
                  </span>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Venture pipeline — stages, not published ventures */}
          <AnimatedSection delay={0.1}>
            <div className="mt-16">
              <p className="text-text-light text-xs tracking-wider uppercase mb-8 text-center">
                Pipeline stages &mdash; not yet published ventures
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {pipelineStages.map((item, i) => (
                  <li
                    key={item.stage}
                    className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-white/10 p-6 relative"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-orange/20 flex items-center justify-center text-xs font-semibold text-orange">
                        {i + 1}
                      </span>
                      {i < pipelineStages.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="hidden lg:block flex-1 h-px bg-gradient-to-r from-orange/30 to-transparent"
                        />
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-navy dark:text-white mb-1">
                      {item.stage}
                    </h3>
                    <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                      {item.note}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How BLIEVE supports ventures — built from the support-category programmes */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12">
              <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                Venture Support
              </p>
              <h2 className="font-serif text-3xl font-bold text-navy dark:text-white">
                How BLIEVE Supports Ventures
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportPrograms.map((program, i) => (
              <AnimatedSection key={program.id} delay={i * 0.1}>
                <GlowCard className="h-full">
                  <div className="p-6 sm:p-8 h-full flex flex-col">
                    <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center mb-5 text-orange">
                      {getIcon(program.icon, { size: 22 })}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mb-3">
                      {program.title}
                    </h3>
                    <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                      {program.description}
                    </p>
                    <p className="text-xs text-text-light pt-4 border-t border-gray-100 dark:border-white/10">
                      <span className="font-semibold text-navy dark:text-white">
                        For:
                      </span>{" "}
                      {program.for}
                    </p>
                  </div>
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement / partnership CTA */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center bg-navy dark:bg-[#080F24] rounded-3xl p-10 md:p-14 border border-white/10">
              <h2 className="font-serif text-3xl font-bold text-white mb-4">
                Building Something? Let&apos;s Talk.
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
                Founders building through BLIEVE, and collaborators who want to
                back campus-born ventures &mdash; reach out and we&apos;ll take
                it from there.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
                >
                  Register your startup
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Contact BLIEVE
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
