"use client";

import { Award, Calendar, CalendarCheck, CheckCircle, IndianRupee, Sparkles } from "lucide-react";
import Link from "next/link";
import { siteData } from "@/data/siteData";
import AnimatedSection from "@/components/AnimatedSection";
import EventCard from "@/components/EventCard";
import GlowCard from "@/components/GlowCard";

const RECAP_SLUG = "recap-blieve-poster-challenge-2026";
const recapPost = siteData.blogPosts.find((post) => post.slug === RECAP_SLUG);

export default function EventsClient() {
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
                Events
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                What&apos;s Next &mdash; and What We&apos;ve Built
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                The BLIEVE Poster Challenge wrapped in August 2026. The next
                challenge is in the works &mdash; challenges, workshops and
                community sessions, announced first on{" "}
                {siteData.contact.instagramHandle}.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Upcoming */}
      <section
        className="py-20 bg-white dark:bg-[#0F0F1A]"
        aria-labelledby="upcoming-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-orange" aria-hidden="true" />
              </div>
              <div>
                <p className="text-orange font-medium text-sm tracking-wider uppercase">
                  Upcoming
                </p>
                <h2
                  id="upcoming-heading"
                  className="font-serif text-3xl font-bold text-navy dark:text-white"
                >
                  Next at BLIEVE
                </h2>
              </div>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {siteData.events.upcoming.map((event, i) => (
              <AnimatedSection key={event.title} delay={i * 0.1}>
                <GlowCard>
                  <EventCard event={event} />
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section
        className="py-20 bg-pale dark:bg-[#1A1A2E]"
        aria-labelledby="past-events-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-orange" aria-hidden="true" />
              </div>
              <div>
                <p className="text-orange font-medium text-sm tracking-wider uppercase">
                  Past Events
                </p>
                <h2
                  id="past-events-heading"
                  className="font-serif text-3xl font-bold text-navy dark:text-white"
                >
                  What We&apos;ve Done
                </h2>
              </div>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {siteData.events.past.map((event, i) => {
              const highlights = event.highlights
                .split("·")
                .map((part) => part.trim())
                .filter(Boolean);

              return (
                <AnimatedSection key={event.title} delay={i * 0.1}>
                  <div className="bg-white dark:bg-[#252540] rounded-2xl p-6 border border-gray-100 dark:border-white/10 h-full flex flex-col hover:shadow-lg hover:shadow-orange/5 transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-orange text-xs font-medium">
                        {event.date}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        <CheckCircle size={12} aria-hidden="true" />
                        Completed
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mb-4">
                      {event.title}
                    </h3>
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {highlights.map((highlight, hi) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-sm text-text-grey dark:text-gray-400"
                        >
                          <span
                            className="mt-0.5 shrink-0 w-6 h-6 bg-orange/10 dark:bg-orange/20 rounded-lg flex items-center justify-center text-orange"
                            aria-hidden="true"
                          >
                            {hi === 0 ? (
                              <Sparkles size={13} />
                            ) : highlight.startsWith("₹") ? (
                              <IndianRupee size={13} />
                            ) : highlight.toLowerCase().includes("result") ? (
                              <CalendarCheck size={13} />
                            ) : (
                              <Award size={13} />
                            )}
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    {recapPost && (
                      <Link
                        href={`/blog/${recapPost.slug}`}
                        className="inline-flex items-center min-h-11 text-orange text-sm font-medium hover:text-orange-dark transition-colors group/link"
                      >
                        Read the recap
                        <span
                          aria-hidden="true"
                          className="ml-1 group-hover/link:translate-x-1 transition-transform"
                        >
                          &rarr;
                        </span>
                      </Link>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Recaps */}
      {recapPost && (
        <section
          className="py-20 bg-white dark:bg-[#0F0F1A]"
          aria-labelledby="recaps-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-orange" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-orange font-medium text-sm tracking-wider uppercase">
                    Event Recaps
                  </p>
                  <h2
                    id="recaps-heading"
                    className="font-serif text-3xl font-bold text-navy dark:text-white"
                  >
                    Relive the Story
                  </h2>
                </div>
              </div>
            </AnimatedSection>
            <div className="max-w-3xl">
              <AnimatedSection>
                <GlowCard>
                  <article className="p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange/10 dark:bg-orange/20 text-orange">
                        {recapPost.category}
                      </span>
                      <span className="text-xs text-text-light">
                        {recapPost.date} &middot; By {recapPost.author}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
                      <Link
                        href={`/blog/${recapPost.slug}`}
                        className="inline-flex items-center min-h-11 hover:text-orange transition-colors"
                      >
                        {recapPost.title}
                      </Link>
                    </h3>
                    <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-6">
                      {recapPost.excerpt}
                    </p>
                    <Link
                      href={`/blog/${recapPost.slug}`}
                      className="inline-flex items-center min-h-11 text-orange text-sm font-medium hover:text-orange-dark transition-colors group/link"
                    >
                      Read the full recap
                      <span
                        aria-hidden="true"
                        className="ml-1 group-hover/link:translate-x-1 transition-transform"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </article>
                </GlowCard>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
