"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, Camera } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { siteData } from "@/data/siteData";
import { apiUrl } from "@/lib/api";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setError(
        `Something went wrong while sending. Please try again, or email us directly at ${siteData.contact.email}.`
      );
    }
    setLoading(false);
  };

  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
                Contact
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Let&apos;s Connect
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Questions? Ideas? Want to collaborate? We&apos;d love to hear
                from you.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-8">
                  Get in Touch
                </h2>
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy dark:text-white text-sm mb-1">
                        Campus
                      </h3>
                      <p className="text-text-grey dark:text-gray-400 text-sm leading-relaxed">
                        Aditya College of Engineering and Technology (ACET)
                        <br />
                        Bengaluru
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy dark:text-white text-sm mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${siteData.contact.email}`}
                        className="text-text-grey dark:text-gray-400 text-sm hover:text-orange transition-colors inline-flex items-center min-h-11"
                      >
                        {siteData.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy dark:text-white text-sm mb-1">
                        Phone
                      </h3>
                      <a
                        href={`tel:${siteData.contact.phoneHref}`}
                        className="text-text-grey dark:text-gray-400 text-sm hover:text-orange transition-colors inline-flex items-center min-h-11"
                      >
                        {siteData.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-navy dark:text-white text-sm mb-3">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={siteData.contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 min-h-11 bg-orange/10 dark:bg-orange/20 rounded-xl text-orange hover:bg-orange hover:text-white transition-colors text-sm font-medium"
                      aria-label="BLIEVE on Instagram"
                    >
                      <Camera size={16} />
                      {siteData.contact.instagramHandle}
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.2}>
                {submitted ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center"
                  >
                    <CheckCircle
                      size={48}
                      className="text-green-500 mx-auto mb-4"
                      aria-hidden="true"
                    />
                    <h3 className="font-serif text-2xl font-semibold text-navy dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-text-grey dark:text-gray-400">
                      We&apos;ll get back to you as soon as we can. Thanks for
                      reaching out.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-6 md:p-8 space-y-5"
                  >
                    <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-2">
                      Send a Message
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          autoComplete="name"
                          className="w-full px-4 py-3 min-h-11 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          maxLength={254}
                          autoComplete="email"
                          className="w-full px-4 py-3 min-h-11 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                      >
                        Subject *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 min-h-11 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="join">Join BLIEVE</option>
                        <option value="mentor">Become a Mentor</option>
                        <option value="partner">
                          Partnership / Sponsorship
                        </option>
                        <option value="press">Press / Media</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                      >
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        maxLength={4000}
                        className="w-full px-4 py-3 min-h-11 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="contact-website">
                        Leave this field empty
                      </label>
                      <input
                        type="text"
                        id="contact-website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    {error && (
                      <div
                        role="alert"
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300"
                      >
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send Message"}{" "}
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </AnimatedSection>
            </div>
          </div>

          {/* Map */}
          <AnimatedSection>
            <div className="mt-16 bg-pale dark:bg-[#1A1A2E] rounded-3xl p-6 md:p-10 border border-orange/20">
              <div className="text-center mb-6">
                <MapPin size={40} className="text-orange mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-navy dark:text-white mb-2">
                  Find Us on Campus
                </h3>
                <p className="text-text-grey dark:text-gray-400 text-sm max-w-md mx-auto">
                  {siteData.contact.location}. Follow{" "}
                  {siteData.contact.instagramHandle} for event locations and
                  updates.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-orange/10">
                <iframe
                  title="Map showing Aditya College of Engineering and Technology, Bengaluru"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(siteData.contact.mapQuery)}&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="text-center mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.contact.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-11 text-orange text-sm font-medium hover:underline"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
