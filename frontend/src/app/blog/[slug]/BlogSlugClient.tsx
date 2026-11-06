"use client";

import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { siteData } from "@/data/siteData";
import AnimatedSection from "@/components/AnimatedSection";

function readingMinutes(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogSlugClient({ slug }: { slug: string }) {
  const post = siteData.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-orange hover:underline">Back to Blog</Link>
        </div>
      </section>
    );
  }

  const related = siteData.blogPosts.filter((p) => p.slug !== slug);

  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 min-h-11 text-orange text-sm font-medium mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to Blog
          </Link>
          <span className="block text-orange text-xs font-semibold tracking-wider uppercase mb-3">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <User size={14} aria-hidden="true" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} aria-hidden="true" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} aria-hidden="true" />
              {readingMinutes(post.content)} min read
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-text-grey dark:text-gray-400 leading-relaxed text-lg"
              >
                {paragraph}
              </p>
            ))}
            <div className="mt-10 p-6 bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/20">
              <p className="text-text-grey dark:text-gray-400 text-sm">
                Have something to add?{" "}
                <Link
                  href="/contact"
                  className="text-orange font-medium hover:underline"
                >
                  Write for the BLIEVE blog
                </Link>{" "}
                or follow{" "}
                <a
                  href={siteData.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange font-medium hover:underline"
                >
                  {siteData.contact.instagramHandle}
                </a>{" "}
                for the next story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-pale dark:bg-[#1A1A2E]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-8">
                Related Articles
              </h2>
              <ul className="divide-y divide-gray-200 dark:divide-white/10 border-t border-gray-200 dark:border-white/10">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group flex items-center justify-between gap-4 py-5"
                    >
                      <div>
                        <span className="block text-orange text-xs font-semibold tracking-wider uppercase mb-1">
                          {item.category}
                        </span>
                        <span className="font-serif text-lg font-semibold text-navy dark:text-white group-hover:text-orange transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <ArrowLeft
                        size={18}
                        className="text-orange shrink-0 rotate-180 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
