import type { Metadata } from "next";
import JourneyClient from "./JourneyClient";

export const metadata: Metadata = {
  title: "Student Journey",
  description:
    "Follow the BLIEVE student journey: from joining the community to launching a startup and creating jobs.",
};

export default function JourneyPage() {
  return <JourneyClient />;
}
