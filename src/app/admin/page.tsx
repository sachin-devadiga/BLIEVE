import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin",
  description: "BLIEVE E-Cell membership application review console.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
