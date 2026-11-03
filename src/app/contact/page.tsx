import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BLIEVE — email, phone, Instagram, or send us a message. The Entrepreneurship Cell of ACET Bengaluru is easy to reach.",
};

export default function ContactPage() {
  return <ContactClient />;
}
