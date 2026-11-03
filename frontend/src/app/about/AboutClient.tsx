"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteData } from "@/data/siteData";
import { getIcon } from "@/lib/icons";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";

const ecosystemLinks = [
  {
    href: "/programs",
    title: "Programmes",
    description:
      "Workshops, bootcamps, hackathons, pitch competitions, mentorship and incubation — 14 programmes across learning, competition, support and community.",
  },
  {
    href: "/journey",
    title: "The Nine-Stage Journey",
    description:
      "The full path every BLIEVE team moves along — from joining and learning to validating, launching and creating jobs.",
  },
  {
    href: "/startups",
    title: "Startups",
    description:
      "The ventures born and building inside the BLIEVE ecosystem, from first idea to first customers.",
  },
];

export default function AboutClient() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                About BLIEVE
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Where <GradientText>Belief</GradientText> Becomes Business
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Belief is the raw material. We build the rest &mdash; an
                ecosystem where an unfinished idea can be voiced, tested, built
                and grown into a venture.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Who We Are
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-6">
                Not a club. A launchpad.
              </h2>
              <div className="space-y-4 text-text-grey dark:text-gray-400 leading-relaxed">
                <p>
                  BLIEVE is the official student-run Entrepreneurship Cell of
                  Aditya College of Engineering and Technology (ACET),
                  Bengaluru. It is an ecosystem built by students, for students
                  &mdash; where an unfinished idea can be voiced, tested, built
                  and grown into a venture that creates jobs and serves
                  society. The name itself is the method: every founder here
                  moves through Believe, Learn, Innovate, Execute, Venture and
                  Excel.
                </p>
                <p>
                  BLIEVE exists to make entrepreneurship a viable, visible and
                  well-supported path for students at ACET &mdash; as credible a
                  career choice on this campus as placements or higher studies.
                  We do this through entrepreneurial education, innovation,
                  mentorship, industry collaboration and hands-on startup
                  experience.
                </p>
                <p>
                  Our goal is not simply to organise events. It is to build
                  ventures that create real economic and social value, and to
                  leave behind a model other institutions can adopt.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-12 relative border border-orange/10">
                <blockquote className="font-serif text-2xl md:text-3xl font-semibold text-navy dark:text-white leading-snug italic mb-6">
                  &ldquo;BLIEVE takes its name from the middle of the word
                  &lsquo;believe&rsquo; &mdash; deliberately dropping the first
                  letter to signal that belief is only the starting point, not
                  the destination.&rdquo;
                </blockquote>
                <p className="text-text-grey dark:text-gray-400 text-sm">
                  &mdash; The idea behind the name</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What BLIEVE Stands For — the B-LIEVE acronym */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                The B-LIEVE Acronym
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                What BLIEVE Stands For
              </h2>
              <p className="text-text-grey dark:text-gray-400 leading-relaxed">
                {siteData.fullForm} &mdash; six letters, each one a stage of the
                founder&apos;s path.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.journey.map((step, i) => (
              <AnimatedSection key={step.label} delay={i * 0.08}>
                <div className="bg-white dark:bg-[#252540] rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg hover:shadow-orange/5 transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center text-orange shrink-0">
                      {getIcon(step.icon, { size: 22 })}
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold text-orange">
                        {step.label.charAt(0)}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-navy dark:text-white">
                        {step.label}
                      </h3>
                    </div>
                  </div>
                  <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Official Vision & Mission */}
      <section className="py-20 bg-navy dark:bg-[#080F24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Vision &amp; Mission
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 h-full">
                <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                  Our Vision
                </p>
                <p className="font-serif text-xl md:text-2xl font-semibold text-white mb-5 leading-relaxed">
                  {siteData.vision.statement}
                </p>
                <div className="pt-5 border-t border-white/10">
                  <p className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">
                    Aspiration Targets
                  </p>
                  <ul className="grid grid-cols-3 gap-4">
                    {siteData.vision.targets.map((target) => (
                      <li key={target.label}>
                        <p className="font-serif text-xl font-bold text-orange">
                          {target.value}
                        </p>
                        <p className="text-white/50 text-xs leading-snug mt-1">
                          {target.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-white/40 text-xs mt-4">{siteData.vision.meta}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 h-full">
                <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                  Our Mission
                </p>
                <p className="font-serif text-xl md:text-2xl font-semibold text-white mb-5 leading-relaxed">
                  {siteData.mission}
                </p>
                <div className="pt-5 border-t border-white/10">
                  <p className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">
                    Mission Pillars
                  </p>
                  <ul className="space-y-4">
                    {siteData.missionPillars.map((item) => (
                      <li key={item.pillar}>
                        <p className="text-white font-semibold text-sm">
                          {item.pillar}
                        </p>
                        <p className="text-white/50 text-xs leading-relaxed mt-0.5">
                          {item.practice}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Core Values
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white">
                What We Stand For
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg hover:shadow-orange/5 transition-shadow h-full">
                  <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center text-orange mb-4">
                    {getIcon(value.icon, { size: 22 })}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy — Dream, Believe, Build, Lead, Impact */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Brand Philosophy
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                How We Think About Building
              </h2>
              <p className="text-text-grey dark:text-gray-400 leading-relaxed">
                Five ideas that shape every programme, mentorship match and
                decision we make.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.brandPhilosophy.map((item, i) => (
              <AnimatedSection key={item.word} delay={i * 0.08}>
                <div className="h-full bg-white dark:bg-[#252540] rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg hover:shadow-orange/5 transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center text-orange shrink-0">
                      {getIcon(item.icon, { size: 20 })}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-navy dark:text-white">
                      {item.word}
                    </h3>
                  </div>
                  <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Long-Term Goals */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-navy dark:bg-[#080F24] rounded-3xl p-8 md:p-10 border border-orange/10">
              <h2 className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                Long-Term Goals
              </h2>
              <p className="text-white/50 text-sm mb-6">
                Four ambitions that define what a mature BLIEVE looks like.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteData.longTermGoals.map((goal) => (
                  <div key={goal.label}>
                    <p className="font-serif text-2xl font-bold text-white">
                      {goal.value}
                    </p>
                    <p className="text-white/50 text-sm leading-snug mt-1">
                      {goal.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Entrepreneurship Ecosystem */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                The Ecosystem
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                How the Pieces Fit Together
              </h2>
              <p className="text-text-grey dark:text-gray-400 leading-relaxed">
                Programs, a staged journey and the ventures themselves — explore
                each part of the BLIEVE ecosystem.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecosystemLinks.map((item, i) => (
              <AnimatedSection key={item.href} delay={i * 0.1}>
                <Link href={item.href} className="block h-full group">
                  <div className="h-full bg-pale dark:bg-[#1A1A2E] rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-orange/40 hover:shadow-lg hover:shadow-orange/5 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif text-xl font-semibold text-navy dark:text-white group-hover:text-orange transition-colors">
                        {item.title}
                      </h3>
                      <ArrowRight
                        size={18}
                        className="text-orange shrink-0 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Student Participation Opportunities */}
      <section className="py-20 bg-navy dark:bg-[#080F24] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Who It&apos;s For
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                Get Involved
              </h2>
              <p className="text-white/60 leading-relaxed">
                BLIEVE is built by students, but it runs on a wider community.
                If you build, fund, mentor or support ventures, there is a place
                for you here.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {siteData.audiences.map((audience, i) => (
              <AnimatedSection key={audience.audience} delay={i * 0.06}>
                <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="font-serif text-lg font-semibold text-white mb-1">
                    {audience.audience}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {audience.offers}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="text-center">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
              >
                Apply to Join BLIEVE
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <p className="text-white/40 text-sm mt-4">
                Have an unreasonable idea? Bring it.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
