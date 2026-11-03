import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your BLIEVE E-Cell account and session.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
