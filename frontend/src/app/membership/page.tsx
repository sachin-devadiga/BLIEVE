import type { Metadata } from "next";
import MembershipClient from "./MembershipClient";

export const metadata: Metadata = {
  title: "Join BLIEVE E-Cell",
  description:
    "Apply for BLIEVE E-Cell startup membership at ACET Bengaluru. For students actively working on at least one startup. Where Belief Becomes Business.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  return <MembershipClient />;
}
