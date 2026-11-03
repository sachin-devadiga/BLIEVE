import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, INSTITUTION } from "@/config/site";
import { siteData } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of Use for the ${SITE_NAME} website — the Entrepreneurship Cell of ${INSTITUTION}, Bengaluru.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
            Legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Terms of Use
          </h1>
          <p className="text-white/60 text-sm">
            Last updated: October 2026 &middot; {SITE_NAME} &mdash; E-Cell,{" "}
            {INSTITUTION}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-text-grey dark:text-gray-400 leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              About this website
            </h2>
            <p>
              This website is operated by {SITE_NAME}, the student-run
              Entrepreneurship Cell of {INSTITUTION}, Bengaluru. By using this
              site, you agree to these terms.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Information on this site
            </h2>
            <p>
              We aim to keep programme details, event information, and contact
              details accurate and current. Details of opportunities such as
              fees, dates, or eligibility are announced only through our
              official channels &mdash; including{" "}
              <a
                href={siteData.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:underline"
              >
                {siteData.contact.instagramHandle}
              </a>{" "}
              and this website. Nothing on this site constitutes a binding
              offer, and we may update content without notice.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Applications and submissions
            </h2>
            <p>
              Submitting a form does not guarantee selection, mentorship, or
              partnership. Application timelines and outcomes, when applicable,
              are communicated directly to applicants.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Acceptable use
            </h2>
            <p>
              You agree not to misuse this site &mdash; including attempting to
              disrupt its operation, submitting false or harmful content
              through its forms, or impersonating others.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Intellectual property
            </h2>
            <p>
              The {SITE_NAME} name, logo, and website content belong to{" "}
              {SITE_NAME}, {INSTITUTION}. College crest and institutional
              marks belong to {INSTITUTION}. Content may not be reproduced
              without permission.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-3">
              Contact
            </h2>
            <p>
              Questions about these terms:{" "}
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
