"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, Handshake } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ApplyForm from "@/components/ApplyForm";

type ApplyType = "student" | "mentor" | "sponsor";

const validTypes: ApplyType[] = ["student", "mentor", "sponsor"];

const paths: {
  id: ApplyType;
  label: string;
  Icon: typeof Users;
  title: string;
  description: string;
  who: string;
}[] = [
  {
    id: "student",
    label: "Students",
    Icon: Users,
    title: "Join BLIEVE",
    description:
      "Be part of a community that takes ideas from napkin sketches to real businesses. Access mentors, programs, and funding connections.",
    who: "Any college student with curiosity, drive, and a willingness to build.",
  },
  {
    id: "mentor",
    label: "Mentors",
    Icon: GraduationCap,
    title: "Apply to Mentor",
    description:
      "Share your experience with the next generation of founders. Structured commitment, meaningful impact, and connections with sharp young minds.",
    who: "Entrepreneurs, industry professionals, investors, and experienced operators.",
  },
  {
    id: "sponsor",
    label: "Sponsors & Investors",
    Icon: Handshake,
    title: "Partner with Us",
    description:
      "Sponsor events, mentor student founders, or meet campus ventures early in their journey. Partner with BLIEVE at any stage of the ecosystem.",
    who: "Angel investors, VCs, corporate innovation teams, and sponsors.",
  },
];

export default function ApplyClient() {
  const [activePath, setActivePath] = useState<ApplyType>("student");
  const activeInfo = paths.find((p) => p.id === activePath)!;

  // Preselect tab from ?type=student|mentor|sponsor.
  // Read via window.location in an effect — avoids wrapping the page in
  // <Suspense>, which Next 16 requires for useSearchParams during prerender.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("type");
    if (requested && validTypes.includes(requested as ApplyType)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing tab state from the URL, an external system
      setActivePath(requested as ApplyType);
    }
  }, []);

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
                Get Involved
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Three Ways to Be Part of BLIEVE
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Whether you&apos;re a student with an idea, a founder who wants
                to give back, or an investor looking for early-stage dealflow —
                there&apos;s a place for you.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div
              role="group"
              aria-label="Application type"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            >
              {paths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setActivePath(path.id)}
                  aria-pressed={activePath === path.id}
                  aria-controls="apply-path-info"
                  className={`p-6 rounded-2xl text-left border-2 transition-all ${
                    activePath === path.id
                      ? "border-orange bg-pale dark:bg-[#1A1A2E] shadow-lg shadow-orange/10"
                      : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A2E] hover:border-gray-200 dark:hover:border-white/20"
                  }`}
                >
                  <path.Icon
                    size={28}
                    aria-hidden="true"
                    className={activePath === path.id ? "text-orange" : "text-navy dark:text-white"}
                  />
                  <h3 className="font-serif text-xl font-semibold text-navy dark:text-white mt-3 mb-1">
                    {path.label}
                  </h3>
                  <p className="text-text-grey dark:text-gray-400 text-sm">
                    {path.description.substring(0, 80)}...
                  </p>
                </button>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div
              id="apply-path-info"
              className="bg-pale dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-10 mb-10 border border-orange/10"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy dark:text-white mb-3">
                {activeInfo.title}
              </h2>
              <p className="text-text-grey dark:text-gray-400 leading-relaxed mb-4">
                {activeInfo.description}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-navy dark:text-white">
                  Who this is for:
                </span>{" "}
                <span className="text-text-grey dark:text-gray-400">{activeInfo.who}</span>
              </p>
              {activePath === "student" && (
                <p className="text-sm mt-4 pt-4 border-t border-orange/10">
                  <span className="text-text-grey dark:text-gray-400">
                    Already working on a startup?{" "}
                  </span>
                  <Link
                    href="/membership"
                    className="font-semibold text-orange hover:underline max-sm:inline-flex max-sm:items-center max-sm:min-h-11"
                  >
                    Apply for startup membership instead
                  </Link>
                </p>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <ApplyForm type={activePath} />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
