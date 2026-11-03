import type { Metadata } from "next";
import ApplyClient from "./ApplyClient";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Three ways to join BLIEVE — as a student, mentor, or sponsor. Choose your path and send us an application.",
};

export default function ApplyPage() {
  return <ApplyClient />;
}
