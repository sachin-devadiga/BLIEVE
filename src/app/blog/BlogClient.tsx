"use client";

import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
import { siteData } from "@/data/siteData";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";

function readingMinutes(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogClient() {
  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Blog & Resources
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Stories, Insights & Learning
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Founder stories, practical advice, and what we&apos;re learning
                about building ventures from campus.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteData.blogPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <GlowCard>
                    <article className="flex flex-col h-full">
                      <div className="bg-gradient-to-br from-navy dark:from-[#1A1A2E] to-navy-light dark:to-[#252540] p-8">
                        <span className="inline-block text-orange text-xs font-semibold tracking-wider uppercase bg-orange/10 dark:bg-orange/20 rounded-full px-3 py-1">
                          {post.category}
                        </span>
                        <h2 className="font-serif text-2xl font-semibold text-white mt-4">
                          {post.title}
                        </h2>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-text-light">
                          <span className="flex items-center gap-1.5">
                            <User size={12} aria-hidden="true" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} aria-hidden="true" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} aria-hidden="true" />
                            {readingMinutes(post.content)} min read
                          </span>
                        </div>
                      </div>
                    </article>
                  </GlowCard>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="mt-16 bg-pale dark:bg-[#1A1A2E] rounded-3xl p-10 md:p-14 text-center border border-orange/10">
              <h2 className="font-serif text-3xl font-bold text-navy dark:text-white mb-4">
                Write for BLIEVE
              </h2>
              <p className="text-text-grey dark:text-gray-400 max-w-lg mx-auto mb-6">
                We&apos;re building out a library of founder stories, learning
                resources, and campus startup news. Want to contribute? Write
                for BLIEVE.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
