"use client";

import { useEffect, useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { apiUrl } from "@/lib/api";

type ApplyType = "student" | "mentor" | "sponsor";

const fieldCopy: Record<
  ApplyType,
  {
    detailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
  }
> = {
  student: {
    detailPlaceholder: "Select year",
    messageLabel: "Why do you want to join BLIEVE?",
    messagePlaceholder: "Share what excites you about entrepreneurship...",
  },
  mentor: {
    detailPlaceholder: "Describe your areas of expertise or experience",
    messageLabel: "Tell us about your experience",
    messagePlaceholder: "Share your background and areas of expertise...",
  },
  sponsor: {
    detailPlaceholder: "Your organisation or company name",
    messageLabel: "How would you like to partner?",
    messagePlaceholder: "Describe your partnership interest...",
  },
};

const inputClass =
  "w-full px-4 py-3 bg-surface dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all disabled:opacity-60";

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-orange">
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

export default function ApplyForm({
  type = "student",
}: {
  type?: ApplyType;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    expertise: "",
    organisation: "",
    message: "",
    website: "", // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever the application type changes (tab switch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate state reset keyed on the `type` prop
    setFormData({
      name: "",
      email: "",
      phone: "",
      year: "",
      expertise: "",
      organisation: "",
      message: "",
      website: "",
    });
    setSubmitted(false);
    setError(null);
    setLoading(false);
  }, [type]);

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
      const payload: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        year: formData.year,
        message: formData.message,
        type,
        website: formData.website,
      };
      if (type === "mentor") payload.expertise = formData.expertise;
      if (type === "sponsor") payload.organisation = formData.organisation;

      const res = await fetch(apiUrl("/api/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong while submitting. Please try again, or email us at president@blieve.in."
      );
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center"
      >
        <CheckCircle size={48} aria-hidden="true" className="text-green-500 mx-auto mb-4" />
        <h3 className="font-serif text-2xl font-semibold text-navy dark:text-white mb-2">
          Application Received!
        </h3>
        <p className="text-text-grey dark:text-gray-400">
          Thank you for your interest. Your application has been recorded,
          and our team will review it and reach out to you if there&apos;s a
          match.
        </p>
      </div>
    );
  }

  const copy = fieldCopy[type];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-white/10 p-6 md:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="apply-name"
            className="block text-sm font-medium text-navy dark:text-white mb-1.5"
          >
            Full Name <RequiredMark />
          </label>
          <input
            type="text"
            id="apply-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            autoComplete="name"
            disabled={loading}
            className={inputClass}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label
            htmlFor="apply-email"
            className="block text-sm font-medium text-navy dark:text-white mb-1.5"
          >
            Email <RequiredMark />
          </label>
          <input
            type="email"
            id="apply-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={254}
            autoComplete="email"
            disabled={loading}
            className={inputClass}
            placeholder="you@college.edu"
          />
        </div>
        <div>
          <label
            htmlFor="apply-phone"
            className="block text-sm font-medium text-navy dark:text-white mb-1.5"
          >
            Phone
          </label>
          <input
            type="tel"
            id="apply-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength={30}
            autoComplete="tel"
            disabled={loading}
            className={inputClass}
            placeholder="+91 98765 43210"
          />
        </div>
        {type === "student" ? (
          <div>
            <label
              htmlFor="apply-year"
              className="block text-sm font-medium text-navy dark:text-white mb-1.5"
            >
              Year of Study <RequiredMark />
            </label>
            <select
              id="apply-year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              disabled={loading}
              className={inputClass}
            >
              <option value="">Select year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
              <option value="pg">Postgraduate</option>
            </select>
          </div>
        ) : type === "mentor" ? (
          <div>
            <label
              htmlFor="apply-expertise"
              className="block text-sm font-medium text-navy dark:text-white mb-1.5"
            >
              Area of expertise / experience
            </label>
            <input
              type="text"
              id="apply-expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              maxLength={200}
              disabled={loading}
              className={inputClass}
              placeholder={copy.detailPlaceholder}
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="apply-organisation"
              className="block text-sm font-medium text-navy dark:text-white mb-1.5"
            >
              Organisation / Company
            </label>
            <input
              type="text"
              id="apply-organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              maxLength={200}
              autoComplete="organization"
              disabled={loading}
              className={inputClass}
              placeholder={copy.detailPlaceholder}
            />
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="apply-message"
          className="block text-sm font-medium text-navy dark:text-white mb-1.5"
        >
          {copy.messageLabel} <RequiredMark />
        </label>
        <textarea
          id="apply-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          maxLength={4000}
          disabled={loading}
          className={`${inputClass} resize-none`}
          placeholder={copy.messagePlaceholder}
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="apply-website">Leave this field empty</label>
        <input
          type="text"
          id="apply-website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div aria-live="polite">
        {error && (
          <div
            role="alert"
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            {error}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}{" "}
        <Send size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
