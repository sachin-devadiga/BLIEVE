"use client";

import Link from "next/link";
import { ArrowRight, Check, Mail, User } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import MembershipForm from "./MembershipForm";

const REQUIREMENTS = [
  "Applicants must be students of ACET Bengaluru.",
  "Applicants must be actively working on at least one startup.",
  "Applicants must provide accurate personal and startup information.",
  "Applicants must agree to follow BLIEVE E-Cell's rules and guidelines.",
  "Membership is subject to eligibility verification and approval.",
];

export default function MembershipClient() {
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
                Membership
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Join BLIEVE E-Cell
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-3">
                Turn your ideas into ventures. Build, innovate, and grow with a
                community of entrepreneurs.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                Aditya College of Engineering and Technology (ACET), Bengaluru.
                Where Belief Becomes Business.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="#apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
                >
                  Apply for Membership
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Other ways to join
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-pale dark:bg-[#1A1A2E] rounded-3xl p-6 md:p-8 border border-orange/10 mb-12">
              <p className="text-navy dark:text-white font-semibold leading-relaxed">
                BLIEVE E-Cell is a platform for students who are serious about
                building startups. Applicants must be actively working on at
                least one startup to be eligible for membership.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy dark:text-white mb-6">
              Membership Requirements
            </h2>
            <ul className="space-y-4">
              {REQUIREMENTS.map((requirement) => (
                <li key={requirement} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-orange/10 dark:bg-orange/20 flex items-center justify-center">
                    <Check
                      size={14}
                      aria-hidden="true"
                      className="text-orange"
                    />
                  </span>
                  <span className="text-text-grey dark:text-gray-400 leading-relaxed">
                    {requirement}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      <section
        id="apply"
        className="py-16 lg:py-20 bg-surface dark:bg-[#0B0B14] scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-8">
              <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
                Application Form
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy dark:text-white">
                Startup Membership Registration
              </h2>
            </div>
          </AnimatedSection>
          <MembershipForm />
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-navy dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-10 text-white">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                Want to join BLIEVE E-Cell?
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 max-w-2xl">
                Students who are actively working on at least one startup can
                apply for membership through the registration form.
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider mb-4">
                For questions or assistance, contact
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4">
                  <User size={20} aria-hidden="true" className="text-orange" />
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Faculty Coordinator
                    </p>
                    <p className="font-semibold">Prof. Prakash M</p>
                  </div>
                </div>
                <a
                  href="mailto:president@blieve.in"
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors"
                >
                  <Mail size={20} aria-hidden="true" className="text-orange" />
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Email
                    </p>
                    <p className="font-semibold">president@blieve.in</p>
                  </div>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
