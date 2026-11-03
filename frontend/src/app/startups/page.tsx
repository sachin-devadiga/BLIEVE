import type { Metadata } from "next";
import StartupsClient from "./StartupsClient";

export const metadata: Metadata = {
  title: "Startups",
  description:
    "BLIEVE's venture portfolio — 4 ventures in the pipeline. Published founder stories will appear here as ventures launch from ACET, Bengaluru.",
};

export default function StartupsPage() {
  return <StartupsClient />;
}
