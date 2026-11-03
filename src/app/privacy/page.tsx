import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, INSTITUTION } from "@/config/site";
import { siteData } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for the ${SITE_NAME} website — the Entrepreneurship Cell of ${INSTITUTION}, Bengaluru.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
            Legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-sm">
            Last updated: October 2026 &middot; {SITE_NAME} &mdash; E-Cell,{" "}
            {INSTITUTION}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-custom space-y-8 text-text-grey dark:text-gray-400 leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              What we collect
            </h2>
            <p>
              When you submit a form on this website (contact, application, or
              newsletter), we receive the information you choose to provide:
              typically your name, email address, and the message or details in
              your submission. Browsing the site does not require an account.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              How we use it
            </h2>
            <p>
              Information submitted through these forms is used only to respond
              to your enquiry, consider your application, or share updates you
              requested. We do not sell personal information.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Storage and third parties
            </h2>
            <p>
              This website currently forwards form submissions to the site
              server, where they are processed to deliver your message. The
              embedded Google Map on the contact page is provided by Google and
              is subject to Google&apos;s own privacy policy. Instagram links
              lead to instagram.com.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Your choices
            </h2>
            <p>
              You may request access to, correction of, or removal of personal
              information you have submitted by emailing{" "}
              <a
                href={`mailto:${siteData.contact.email}`}
                className="text-orange hover:underline"
              >
                {siteData.contact.email}
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Changes to this policy
            </h2>
            <p>
              We may update this page as the website evolves. Questions about
              this policy can be sent to{" "}
              <a
                href={`mailto:${siteData.contact.email}`}
                className="text-orange hover:underline"
              >
                {siteData.contact.email}
              </a>
              .
            </p>
          </div>
          <p>
            <Link href="/" className="text-orange hover:underline">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
