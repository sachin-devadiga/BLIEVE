import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Founder stories, practical advice and campus startup news from BLIEVE — the student-run Entrepreneurship Cell of ACET, Bengaluru.",
};

export default function BlogPage() {
  return <BlogClient />;
}
