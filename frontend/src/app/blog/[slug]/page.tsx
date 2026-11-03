import { notFound } from "next/navigation";
import { siteData } from "@/data/siteData";
import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import BlogSlugClient from "./BlogSlugClient";

export function generateStaticParams() {
  return siteData.blogPosts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = siteData.blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  const parsedDate = new Date(post.date);
  const publishedTime = Number.isNaN(parsedDate.getTime())
    ? undefined
    : parsedDate.toISOString();

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      ...(publishedTime ? { publishedTime } : {}),
      authors: [post.author],
      url: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const post = siteData.blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogSlugClient slug={slug} />;
}
