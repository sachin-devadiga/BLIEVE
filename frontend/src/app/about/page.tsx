import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "The founding story, official vision, mission and values of BLIEVE — the student-run Entrepreneurship Cell of ACET Bengaluru, created to make entrepreneurship a viable, visible path for students.",
};

export default function AboutPage() {
  return <AboutClient />;
}
