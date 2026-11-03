"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  ArrowRight,
  ClipboardList,
  LogOut,
  Mail,
  Rocket,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import {
  getSession,
  getServerSession,
  subscribeSession,
} from "@/lib/clientAuth";
import { signOutEverywhere } from "@/lib/signOut";

function formatSignedIn(time: number): string {
  try {
    return new Date(time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "Unknown";
  }
}

export default function ProfileClient() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession
  );

  if (!session) {
    return (
      <section className="min-h-screen bg-surface dark:bg-[#0B0B14] pt-32 lg:pt-40 pb-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl font-bold text-navy dark:text-white mb-3">
            You are not signed in
          </h1>
          <p className="text-text-grey dark:text-gray-400 mb-8">
            Sign in to view your BLIEVE account details.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
          >
            Go to Login
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const isAdmin = session.role === "admin";
  const homeHref = isAdmin ? "/admin" : "/dashboard";

  const signOut = () => {
    signOutEverywhere();
    router.push("/login");
  };

  return (
    <>
      <section className="bg-navy dark:bg-[#080F24] pt-32 lg:pt-40 pb-16 lg:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl bg-orange text-white flex items-center justify-center font-serif font-bold text-3xl shrink-0"
                aria-hidden="true"
              >
                {session.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-orange font-medium text-xs mb-1.5 tracking-wider uppercase">
                  {isAdmin ? "Administrator" : "Member"} Account
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white break-words">
                  {session.name}
                </h1>
                <p className="text-white/55 text-sm mt-1 break-all">
                  {session.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href={homeHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
              >
                {isAdmin ? (
                  <ClipboardList size={17} aria-hidden="true" />
                ) : (
                  <Rocket size={17} aria-hidden="true" />
                )}
                {isAdmin ? "Open Admin Console" : "Go to my dashboard"}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Back to site
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-[#0F0F1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <AnimatedSection>
            <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-6">
              Account details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5">
                <dt className="text-xs text-text-light dark:text-white/40 mb-1">
                  Full name
                </dt>
                <dd className="font-semibold text-navy dark:text-white break-words">
                  {session.name}
                </dd>
              </div>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5">
                <dt className="text-xs text-text-light dark:text-white/40 mb-1">
                  Role
                </dt>
                <dd className="font-semibold text-navy dark:text-white">
                  {isAdmin ? "Administrator" : "Member"}
                </dd>
              </div>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5">
                <dt className="text-xs text-text-light dark:text-white/40 mb-1">
                  Email
                </dt>
                <dd className="font-mono text-sm text-navy dark:text-white break-all">
                  {session.email}
                </dd>
              </div>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5">
                <dt className="text-xs text-text-light dark:text-white/40 mb-1">
                  Title
                </dt>
                <dd className="font-semibold text-navy dark:text-white">
                  {session.title}
                </dd>
              </div>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5">
                <dt className="text-xs text-text-light dark:text-white/40 mb-1">
                  Signed in
                </dt>
                <dd className="font-semibold text-navy dark:text-white">
                  {formatSignedIn(session.loginTime)}
                </dd>
              </div>
              <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5">
                <dt className="text-xs text-text-light dark:text-white/40 mb-1">
                  Access level
                </dt>
                <dd className="font-semibold text-navy dark:text-white">
                  {isAdmin ? "Full console access" : "Member area only"}
                </dd>
              </div>
            </dl>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-navy dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-10">
              <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
                Session
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                Sign out of this device
              </h2>
              <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                Logging out clears your identity on this browser and ends the
                administrator session cookie. You will need to sign in again to
                reach your dashboard or the review console.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
                >
                  <LogOut size={17} aria-hidden="true" />
                  Logout
                </button>
                <a
                  href="mailto:president@blieve.in"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white/80 font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Mail size={17} aria-hidden="true" />
                  Contact support
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-navy dark:text-white mb-4">
                Need help?
              </h2>
              <dl className="space-y-3 text-sm">
                {!isAdmin && (
                  <div className="flex flex-wrap gap-x-3">
                    <dt className="text-text-light dark:text-white/40">
                      Faculty Coordinator:
                    </dt>
                    <dd className="font-medium text-navy dark:text-white">
                      Prof. Prakash M
                    </dd>
                  </div>
                )}
                <div className="flex flex-wrap gap-x-3">
                  <dt className="text-text-light dark:text-white/40">
                    Email:
                  </dt>
                  <dd>
                    <a
                      href="mailto:president@blieve.in"
                      className="font-medium text-orange hover:underline"
                    >
                      president@blieve.in
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
