"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ArrowRight, Camera } from "lucide-react";
import { useState } from "react";
import { siteData } from "@/data/siteData";
import { INSTITUTION, INSTITUTION_SHORT, INSTITUTION_LOCATION } from "@/config/site";
import { apiUrl } from "@/lib/api";

const exploreLinks = [
  { label: "About Us", path: "/about" },
  { label: "Membership", path: "/membership" },
  { label: "Programs", path: "/programs" },
  { label: "Journey", path: "/journey" },
  { label: "Startups", path: "/startups" },
  { label: "Events", path: "/events" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const involvedLinks = [
  { label: "Apply as a Student", path: "/apply" },
  { label: "Become a Mentor", path: "/apply" },
  { label: "Partner with BLIEVE", path: "/apply" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading || subscribed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/newsletter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, website: honeypot }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubscribed(true);
      setEmail("");
    } catch {
      setError("Could not subscribe. Please try again.");
    }
    setLoading(false);
  };

  return (
    <footer className="bg-navy dark:bg-[#080F24] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative w-11 h-11 rounded-full bg-white ring-1 ring-white/20 overflow-hidden shrink-0">
                <Image
                  src="/blieve-logo.png"
                  alt="BLIEVE E-Cell logo"
                  fill
                  sizes="44px"
                  className="object-contain scale-[1.05]"
                />
              </span>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  BLI<span className="text-orange">E</span>VE
                </span>
                <span className="block text-[10px] text-white/50 tracking-[0.2em] uppercase -mt-0.5">
                  E-Cell &middot; {INSTITUTION_SHORT}
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-3">
              {siteData.tagline} The student-run Entrepreneurship Cell of{" "}
              {INSTITUTION}, {INSTITUTION_LOCATION} &mdash; where an unfinished
              idea can be voiced, tested, built and grown into a venture.
            </p>
            <p className="text-white/40 text-xs leading-relaxed mb-6">
              {siteData.fullForm}
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange mb-3">
                Stay in the Loop
              </h4>
              {subscribed ? (
                <div
                  role="status"
                  className="bg-orange/10 border border-orange/30 rounded-xl p-4"
                >
                  <p className="text-orange text-sm font-medium">
                    Thanks &mdash; your subscription request has been received.
                  </p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      maxLength={254}
                      autoComplete="email"
                      className="flex-1 min-w-0 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-orange transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      aria-label="Subscribe to the BLIEVE newsletter"
                      className="px-4 py-2.5 bg-orange text-white rounded-xl hover:bg-orange-light transition-colors disabled:opacity-50"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </form>
                  <p aria-live="polite" className="text-xs mt-2 min-h-4">
                    {error && <span className="text-red-300">{error}</span>}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange mb-4">
              Explore
            </h4>
            <div className="space-y-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.path}
                  className="block text-white/60 text-sm hover:text-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Get Involved */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange mb-4">
              Get Involved
            </h4>
            <div className="space-y-2">
              {involvedLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.path}
                  className="block text-white/60 text-sm hover:text-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-orange mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  {INSTITUTION} ({INSTITUTION_SHORT})
                  <br />
                  {INSTITUTION_LOCATION}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-orange shrink-0" />
                <a
                  href={`mailto:${siteData.contact.email}`}
                  className="text-white/60 text-sm hover:text-orange transition-colors"
                >
                  {siteData.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-orange shrink-0" />
                <a
                  href={`tel:${siteData.contact.phoneHref}`}
                  className="text-white/60 text-sm hover:text-orange transition-colors"
                >
                  {siteData.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Camera size={16} className="text-orange shrink-0" />
                <a
                  href={siteData.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 text-sm hover:text-orange transition-colors"
                >
                  {siteData.contact.instagramHandle}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative w-8 h-8 rounded-full bg-white overflow-hidden shrink-0">
              <Image
                src="/acet-logo.png"
                alt={`${INSTITUTION} crest`}
                fill
                sizes="32px"
                className="object-contain scale-[1.42]"
              />
            </span>
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} BLIEVE &mdash; E-Cell,{" "}
              {INSTITUTION}, {INSTITUTION_LOCATION}. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="text-white/40 hover:text-orange transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-orange transition-colors">
              Terms of Use
            </Link>
            <span className="text-white/40">{siteData.hashtag}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
