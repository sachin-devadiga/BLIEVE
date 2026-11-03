import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past events at BLIEVE — bootcamps, founder talks, hackathons, networking meetups, and more.",
};

export default function EventsPage() {
  return <EventsClient />;
}
