import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { siteData } from "@/data/siteData";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/programs",
    "/journey",
    "/startups",
    "/events",
    "/blog",
    "/contact",
    "/apply",
    "/membership",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const blogRoutes = siteData.blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
