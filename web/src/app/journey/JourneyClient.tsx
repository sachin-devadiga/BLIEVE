"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteData } from "@/data/siteData";
import AnimatedSection from "@/components/AnimatedSection";
import NetworkMap from "@/components/NetworkMap";
import GradientText from "@/components/GradientText";

const stages = siteData.studentJourney;

export default function JourneyClient() {
  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Your Path
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The <GradientText>Student Journey</GradientText>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                From curious student to job creator &mdash; nine stages, one
                pathway, built into everything BLIEVE runs.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Network Visualization */}
      <section className="py-16 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-2">
                The Founder Network
              </h2>
              <p className="text-text-grey dark:text-gray-400 text-sm">
                Watch how ideas flow through our ecosystem
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div
              role="img"
              aria-label="Network visualization of the founder journey: an Idea connects to Research and Team, which feed into Build, then Test, Launch, and finally Scale and Fund."
            >
              <NetworkMap />
            </div>
            <p className="sr-only">
              An Idea connects to Research and Team. Research and Team connect
              to Build. Build connects to Test. Test connects to Launch. Launch
              connects to Scale and Fund.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Nine-stage journey */}
      <section
        className="py-20 bg-pale dark:bg-[#1A1A2E] relative"
        aria-labelledby="journey-stages-heading"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
                Nine Stages
              </p>
              <h2
                id="journey-stages-heading"
                className="font-serif text-3xl font-bold text-navy dark:text-white mb-3"
              >
                From Joining to Creating Jobs
              </h2>
              <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                Every programme at BLIEVE maps onto this single path &mdash;
                wherever you are on it, there is a next step built for you.
              </p>
            </div>
          </AnimatedSection>

          {/* Desktop: connected horizontal stepper */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto pb-6 -mx-4 px-4">
              <ol
                className="flex min-w-max"
                aria-label="The nine stages of the BLIEVE student journey"
              >
                {stages.map((step, i) => (
                  <li
                    key={step.stage}
                    className="w-[250px] shrink-0 px-2 relative"
                  >
                    {/* Connector segments behind the stage dots */}
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-7 left-0 w-1/2 h-0.5 bg-orange/30"
                      />
                    )}
                    {i < stages.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-7 right-0 w-1/2 h-0.5 bg-orange/30"
                      />
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(i * 0.08, 0.5),
                        ease: "easeOut",
                      }}
                      className="flex flex-col items-center h-full"
                    >
                      <div className="relative z-10 w-14 h-14 bg-navy dark:bg-[#080F24] rounded-full flex items-center justify-center border-2 border-orange shadow-lg shadow-orange/10">
                        <span
                          aria-hidden="true"
                          className="font-serif text-lg font-bold text-orange"
                        >
                          {i + 1}
                        </span>
                      </div>
                      <div className="mt-5 w-full flex-1 bg-white dark:bg-[#252540] rounded-2xl p-5 border border-gray-100 dark:border-white/10 hover:border-orange/30 hover:shadow-lg hover:shadow-orange/5 transition-shadow">
                        <h3 className="font-serif text-lg font-bold text-navy dark:text-white mb-2 text-center">
                          <span className="sr-only">Stage {i + 1}: </span>
                          {step.stage}
                        </h3>
                        <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed text-center">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-center text-xs text-text-light dark:text-gray-500 mt-1">
              Scroll sideways to follow all nine stages &rarr;
            </p>
          </div>

          {/* Mobile: vertical connected list */}
          <div className="lg:hidden">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute left-[18px] top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange/40 via-orange/20 to-orange/40"
              />
              <ol
                className="space-y-6"
                aria-label="The nine stages of the BLIEVE student journey"
              >
                {stages.map((step, i) => (
                  <li key={step.stage} className="relative pl-14">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(i * 0.06, 0.4),
                        ease: "easeOut",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1 w-9 h-9 bg-navy dark:bg-[#080F24] rounded-full flex items-center justify-center border-2 border-orange shadow-md z-10 font-serif text-sm font-bold text-orange"
                      >
                        {i + 1}
                      </span>
                      <div className="bg-white dark:bg-[#252540] rounded-2xl p-5 border border-gray-100 dark:border-white/10">
                        <h3 className="font-serif text-lg font-bold text-navy dark:text-white mb-1">
                          <span className="sr-only">Stage {i + 1}: </span>
                          {step.stage}
                        </h3>
                        <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <AnimatedSection>
            <p className="text-center text-text-grey dark:text-gray-400 text-sm mt-12">
              &#8635; Iterative by design &mdash; teams may move back from MVP
              to validation as they learn.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-text-grey dark:text-gray-400 mb-8">
              Every BLIEVE founder started exactly where you are right now.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-all shadow-lg shadow-orange/20"
            >
              Join BLIEVE Now
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
