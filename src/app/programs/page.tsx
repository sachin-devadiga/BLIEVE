import type { Metadata } from "next";
import ProgramsClient from "./ProgramsClient";

export const metadata: Metadata = {
  title: "Programs & Activities",
  description:
    "Explore BLIEVE's programs: hackathons, bootcamps, mentorship, incubation, pitch competitions, workshops, and more.",
};

export default function ProgramsPage() {
  return <ProgramsClient />;
}
