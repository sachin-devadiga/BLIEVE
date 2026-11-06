"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Rocket, Handshake, Sparkles } from "lucide-react";
import { siteData } from "@/data/siteData";
import AnimatedSection from "@/components/AnimatedSection";
import ProgramCard from "@/components/ProgramCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import GlowCard from "@/components/GlowCard";
import HeroVideo from "@/components/HeroVideo";
import { getIcon } from "@/lib/icons";

const ecosystem = [
  {
    key: "learning",
    title: "Learn",
    icon: BookOpen,
    description:
      "Entrepreneurship education, workshops, and practical learning that turn curiosity into capability.",
  },
  {
    key: "competition",
    title: "Compete",
    icon: Zap,
    description:
      "Challenges, competitions, and idea presentations that sharpen entrepreneurial problem-solving.",
  },
  {
    key: "support",
    title: "Build",
    icon: Rocket,
    description:
      "Mentorship, venture development, and startup support from first prototype to first customers.",
  },
  {
    key: "community",
    title: "Connect",
    icon: Handshake,
    description:
      "Industry engagement, founder networking, and a campus community that carries ideas forward.",
  },
] as const;

const featuredIds = [1, 2, 4, 5, 8, 12];

const differences = [
  {
    traditional: "Runs isolated events — one hackathon, one pitch day a year",
    blieve: "Runs a continuous, structured pipeline across the full academic year",
  },
  {
    traditional: "Measures success by attendance and footfall",
    blieve: "Measures success by prototypes shipped, pilots run and ventures launched",
  },
  {
    traditional: "Mentorship is informal or ad hoc",
    blieve: "Mentorship is structured, matched by stage and domain, and tracked",
  },
  {
    traditional: "Treats entrepreneurship as a side interest",
    blieve: "Treats entrepreneurship as a credible, supported career path",
  },
  {
    traditional: "Success is a strong annual fest",
    blieve: "Success is a founder who did not need BLIEVE to keep going",
  },
];

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function HomePage() {
  const featuredPrograms = siteData.programs.filter((p) =>
    featuredIds.includes(p.id)
  );

  return (
    <>
      {/* ============ Section 1: Hero ============ */}
      <section className="relative bg-navy dark:bg-[#080F24] overflow-hidden lg:min-h-screen">
        <HeroVideo />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange/5 rounded-full blur-[100px]" />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block" aria-hidden="true">
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/30 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============ Section 2: Impact statistics ============ */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]" aria-label="Impact statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {siteData.stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <AnimatedCounter
                  value={stat.value}
                  label={stat.label}
                  icon={getIcon(stat.icon, { size: 24 })}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Section 3: Introduction to BLIEVE ============ */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <AnimatedSection className="lg:col-span-5">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Who We Are
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-6 leading-tight">
                Where belief becomes business.
              </h2>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 min-h-11 text-orange font-semibold text-sm hover:gap-3 transition-all"
              >
                Read our story <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="lg:col-span-7">
              <div className="space-y-5 text-text-grey dark:text-gray-400 leading-relaxed">
            <p className="text-text-grey dark:text-gray-400 leading-relaxed">
              <strong className="text-navy dark:text-white font-semibold">
                Belief is the raw material.
              </strong>{" "}
              We build the rest &mdash; entrepreneurial education, mentorship,
              industry collaboration and hands-on experience that carry an idea
              from a napkin sketch to a launch-ready venture.
            </p>
            <p>
              BLIEVE serves students with unfinished ideas, faculty moving
              research towards real-world ventures, alumni who want to give
              back, and partners looking to engage early-stage campus
              builders. Every programme exists to move a student one step
              further along the journey.
            </p>
                <p>
                  You can participate by applying as a student, mentoring
                  ventures, or partnering with the ecosystem &mdash; whether you
                  want to learn, compete, build, or connect.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============ Section 4: Our ecosystem ============ */}
      <section id="ecosystem" className="py-20 bg-white dark:bg-[#0F0F1A] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                Our Ecosystem
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                Four Ways In
              </h2>
              <p className="text-text-grey dark:text-gray-400 max-w-xl mx-auto">
                {siteData.programs.length} real programmes, organised around how
                students actually grow.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystem.map((card, i) => {
              const count = siteData.programs.filter(
                (p) => p.category === card.key
              ).length;
              return (
                <AnimatedSection key={card.key} delay={i * 0.1}>
                  <GlowCard>
                    <div className="p-6 h-full flex flex-col">
                      <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center text-orange mb-4">
                        <card.icon size={22} aria-hidden="true" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed flex-1">
                        {card.description}
                      </p>
                      <p className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 text-xs font-medium text-text-light dark:text-white/40 uppercase tracking-wider">
                        {count} programme{count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </GlowCard>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Section 5: Featured programmes ============ */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                  Programmes
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-3">
                  Featured Programmes
                </h2>
                <p className="text-text-grey dark:text-gray-400 max-w-lg">
                  A selection from our {siteData.programs.length} initiatives
                  across learning, competitions, venture support and community.
                </p>
              </div>
              <Link
                href="/programs"
                className="text-orange font-semibold text-sm inline-flex items-center gap-1 min-h-11 hover:gap-2 transition-all shrink-0"
              >
                All {siteData.programs.length} programmes{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrograms.map((program, i) => (
              <AnimatedSection key={program.id} delay={i * 0.08}>
                <GlowCard>
                  <ProgramCard program={program} />
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Section 6: Entrepreneurship journey ============ */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                The BLIEVE Journey
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                From Student to Job Creator
              </h2>
              <p className="text-text-grey dark:text-gray-400 max-w-xl mx-auto">
                Nine stages, iterative by design &mdash; teams move back and
                forth as they learn.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <ol className="flex flex-wrap justify-center gap-3 mb-8">
              {siteData.studentJourney.map((step, i) => (
                <li
                  key={step.stage}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#252540] border border-gray-100 dark:border-white/10 rounded-full text-sm text-navy dark:text-white"
                >
                  <span className="w-6 h-6 rounded-full bg-orange/10 dark:bg-orange/20 text-orange text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {step.stage}
                </li>
              ))}
            </ol>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="text-center">
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
              >
                Explore the BLIEVE Journey
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ Section 7: Why BLIEVE is different ============ */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                The Difference
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-4">
                Why BLIEVE Is Different
              </h2>
              <p className="text-text-grey dark:text-gray-400 max-w-2xl mx-auto">
                Most campus clubs stop at events and certificates. BLIEVE is
                structured as a pipeline that carries an idea all the way to a
                venture — and measures itself on how many students complete
                that journey.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="hidden md:grid grid-cols-2 gap-px bg-gray-200 dark:bg-white/10 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
              <div className="bg-white dark:bg-[#1A1A2E] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-light dark:text-white/40">
                  A Traditional Entrepreneurship Club
                </p>
              </div>
              <div className="bg-navy dark:bg-[#080F24] px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-orange">
                  BLIEVE
                </p>
              </div>
              {differences.map((row) => (
                <div key={row.blieve} className="contents">
                  <div className="bg-white dark:bg-[#1A1A2E] px-6 py-5">
                    <p className="text-sm text-text-grey dark:text-gray-400">
                      {row.traditional}
                    </p>
                  </div>
                  <div className="bg-navy dark:bg-[#080F24] px-6 py-5">
                    <p className="text-sm font-medium text-white">
                      {row.blieve}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden space-y-4">
              {differences.map((row) => (
                <div
                  key={row.blieve}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A2E] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
                    <p className="text-sm text-text-grey dark:text-gray-400">
                      {row.traditional}
                    </p>
                  </div>
                  <div className="px-5 py-4 bg-navy dark:bg-[#080F24]">
                    <p className="text-sm font-medium text-white">
                      {row.blieve}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ Section 8: Events ============ */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                  Events
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white">
                  Challenges &amp; Competitions
                </h2>
              </div>
              <Link
                href="/events"
                className="text-orange font-semibold text-sm inline-flex items-center gap-1 min-h-11 hover:gap-2 transition-all shrink-0"
              >
                All events <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteData.events.past.map((event, i) => (
              <AnimatedSection key={event.title} delay={i * 0.1}>
                <div className="h-full bg-white dark:bg-[#252540] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/10 flex flex-col">
                  <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-4">
                    Completed
                  </span>
                  <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-orange text-sm font-medium mb-3">
                    {event.date}
                  </p>
                  <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed flex-1">
                    {event.highlights}
                  </p>
                  <Link
                    href="/blog/recap-blieve-poster-challenge-2026"
                    className="mt-5 inline-flex items-center min-h-11 text-orange text-sm font-semibold hover:underline"
                  >
                    Read the recap &rarr;
                  </Link>
                </div>
              </AnimatedSection>
            ))}
            {siteData.events.upcoming.map((event, i) => (
              <AnimatedSection key={event.title} delay={(i + 1) * 0.1}>
                <div className="h-full bg-white dark:bg-[#252540] rounded-2xl p-6 md:p-8 border border-dashed border-orange/30 flex flex-col">
                  <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-orange/10 text-orange mb-4">
                    <Sparkles size={12} aria-hidden="true" /> Coming Soon
                  </span>
                  <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed flex-1">
                    {event.description}
                  </p>
                  <a
                    href={siteData.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center min-h-11 text-orange text-sm font-semibold hover:underline"
                  >
                    Follow {siteData.contact.instagramHandle} for the
                    announcement &rarr;
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Section 9: Startup ecosystem ============ */}
      <section className="py-20 bg-navy dark:bg-[#080F24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Startup Ecosystem
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                4 ventures in the pipeline.
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Our venture portfolio is being curated with the founders&apos;
                approval &mdash; each startup will appear here with its story
                once it is ready to launch publicly. No invented names, no
                premature claims.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/startups"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors"
                >
                  View the portfolio
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  Partner with us
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Idea", "MVP", "Launched", "Funded"].map((stage) => (
                  <div
                    key={stage}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                  >
                    <span className="block w-2 h-2 bg-orange rounded-full mx-auto mb-3" />
                    <span className="text-white/70 text-sm">{stage}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-4 text-center">
                Pipeline stages &mdash; ventures are published as they launch.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============ Section 10: Latest insights ============ */}
      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
                  Insights
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white">
                  Latest from the Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-orange font-semibold text-sm inline-flex items-center gap-1 min-h-11 hover:gap-2 transition-all shrink-0"
              >
                All articles <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteData.blogPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full bg-white dark:bg-[#252540] rounded-2xl border border-gray-100 dark:border-white/10 p-6 hover:border-orange/40 transition-colors"
                >
                  <span className="text-orange text-xs font-semibold tracking-wider uppercase">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-navy dark:text-white mt-3 mb-2 group-hover:text-orange transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <p className="text-text-light text-xs pt-4 border-t border-gray-100 dark:border-white/10">
                    {post.author} &middot; {post.date} &middot;{" "}
                    {readingTime(post.content)} min read
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Section 11: Join BLIEVE ============ */}
      <section className="py-20 bg-pale dark:bg-[#1A1A2E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
              Join the Ecosystem
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-5">
              Where belief becomes business.
            </h2>
            <p className="text-text-grey dark:text-gray-400 text-lg mb-8">
              Apply, mentor or partner &mdash; and take the first step towards
              building something that creates real economic and social value.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
              >
                Join as a Student
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/apply?type=mentor"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy dark:bg-white/10 text-white font-semibold rounded-xl hover:bg-navy-light transition-colors"
              >
                Become a Mentor
              </Link>
              <Link
                href="/apply?type=sponsor"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-transparent text-navy dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-white/20 hover:border-orange hover:text-orange transition-colors"
              >
                Partner with BLIEVE
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ Section 12: Startup Membership ============ */}
      <section className="py-20 bg-navy dark:bg-[#080F24] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 right-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <AnimatedSection>
            <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
              Startup Membership
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              Already building a startup?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Students actively working on at least one startup can apply to
              join BLIEVE E-Cell, get mentorship, and grow alongside other
              founders at ACET Bengaluru.
            </p>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
            >
              Join BLIEVE E-Cell
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
