"use client";

import Link from "next/link";
import { useSyncExternalStore, useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  Mail,
  Rocket,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import {
  getSession,
  getServerSession,
  subscribeSession,
} from "@/lib/clientAuth";
import { apiUrl } from "@/lib/api";
import {
  type ApplicationStatus,
  type ApplicationMeeting,
} from "@/lib/membership/options";

type MyApplication = {
  id: string;
  submittedAt: string;
  status: ApplicationStatus;
  startupName: string;
  meeting: ApplicationMeeting | null;
};

const statusClass: Record<ApplicationStatus, string> = {
  "Pending Review": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  "Under Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function ApprovedMeetingCard({ application }: { application: MyApplication }) {
  const meeting = application.meeting;
  return (
    <AnimatedSection>
      <div className="bg-gradient-to-br from-orange to-orange-light dark:from-orange dark:to-orange/70 rounded-3xl p-6 md:p-10 text-white shadow-lg shadow-orange/20">
        <p className="font-medium text-sm mb-3 tracking-wider uppercase text-white/80 flex items-center gap-2">
          <Calendar size={16} aria-hidden="true" />
          Next step — Meet the E-Cell team
        </p>
        {meeting ? (
          <>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              {formatDate(meeting.at)}
            </h2>
            {meeting.link && (
              <p className="mb-2">
                <span className="font-semibold">Venue / Online:</span>{" "}
                <span className="break-words">{meeting.link}</span>
              </p>
            )}
            {meeting.notes && (
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap max-w-2xl">
                {meeting.notes}
              </p>
            )}
            <p className="mt-4 text-sm text-white/70">
              Bring your startup questions and any material you would like to
              discuss. See you there!
            </p>
          </>
        ) : (
          <h2 className="font-serif text-xl md:text-2xl font-bold">
            Your application was approved! The E-Cell team will contact you
            shortly to schedule your meeting.
          </h2>
        )}
      </div>
    </AnimatedSection>
  );
}

const memberQuickLinks = [
  { label: "Programs", description: "Incubation tracks and support", href: "/programs", Icon: GraduationCap },
  { label: "Events", description: "Workshops, pitch nights, bootcamps", href: "/events", Icon: Calendar },
  { label: "Startups", description: "The ventures built through BLIEVE", href: "/startups", Icon: Rocket },
  { label: "Contact", description: "Reach the E-Cell team", href: "/contact", Icon: Mail },
];

const adminTools = [
  { label: "Membership Applications", description: "Review, verify and decide on student startup applications", href: "/admin", Icon: ClipboardList },
  { label: "Programs", description: "Edit incubation tracks, cohorts and support", href: "/programs", Icon: GraduationCap },
  { label: "Events", description: "Schedule workshops, pitch nights and bootcamps", href: "/events", Icon: Calendar },
  { label: "Startups", description: "Curate the public venture portfolio", href: "/startups", Icon: Rocket },
  { label: "Blog", description: "Publish announcements and event recaps", href: "/blog", Icon: FileText },
  { label: "Journey", description: "The nine-stage student pathway", href: "/journey", Icon: Users },
];

export default function DashboardClient() {
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
            Sign in with your BLIEVE member or administrator account to open
            your dashboard.
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

  return (
    <>
      {isAdmin ? (
        <AdminHero
          name={session.name}
          title={session.title}
          avatar={session.avatar}
        />
      ) : (
        <MemberHero
          name={session.name}
          title={session.title}
          avatar={session.avatar}
        />
      )}

      <section
        className={`py-16 ${
          isAdmin
            ? "bg-surface dark:bg-[#0B0B14]"
            : "bg-white dark:bg-[#0F0F1A]"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {isAdmin ? (
            <AdminBody email={session.email} />
          ) : (
            <MemberBody email={session.email} />
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MEMBER                                                             */
/* ------------------------------------------------------------------ */

function MemberHero({
  name,
  title,
  avatar,
}: {
  name: string;
  title: string;
  avatar: string;
}) {
  return (
    <section className="bg-navy dark:bg-[#080F24] pt-28 pb-16 lg:pt-36 lg:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 h-48 bg-orange rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange rounded-full blur-[120px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="flex flex-wrap items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl bg-orange text-white flex items-center justify-center font-serif font-bold text-2xl shrink-0"
              aria-hidden="true"
            >
              {avatar}
            </div>
            <div className="min-w-0">
              <p className="text-orange font-medium text-xs mb-1.5 tracking-wider uppercase">
                Member Dashboard
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Welcome, {name}
              </h1>
              <p className="text-white/55 text-sm mt-1">{title}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
            >
              <Rocket size={17} aria-hidden="true" />
              Apply for Startup Membership
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Back to site
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white/80 font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-colors"
            >
              <User size={17} aria-hidden="true" />
              Profile
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function MemberBody({ email }: { email: string }) {
  const [applications, setApplications] = useState<MyApplication [] | null>(
    null
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(apiUrl("/api/auth/my-applications"), {
          cache: "no-store",
          credentials: "include",
        });
        if (!response.ok) throw new Error("request failed");
        const data = (await response.json()) as { applications: MyApplication[] };
        if (!cancelled) {
          setApplications(data.applications ?? []);
          setLoadError(null);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Could not load your applications right now.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const latest = applications && applications.length > 0 ? applications[0] : null;
  const tiles: { value: string; label: string }[] = [
    { value: "MEMBER", label: "Your role" },
    {
      value: applications ? String(applications.length) : "…",
      label: "Applications submitted",
    },
    { value: latest ? latest.status : applications ? "None yet" : "…", label: "Latest status" },
    {
      value: latest?.startupName || "—",
      label: "Latest venture",
    },
  ];

  return (
    <>
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-5 text-center"
            >
              <p className="font-mono text-lg md:text-2xl font-semibold text-orange break-words">
                {tile.value}
              </p>
              <p className="text-xs text-text-light dark:text-white/40 mt-1">
                {tile.label}
              </p>
            </div>
          ))}
        </div>
        {loadError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-300">
            {loadError}
          </p>
        )}
      </AnimatedSection>

      {latest?.status === "Approved" && (
        <ApprovedMeetingCard application={latest} />
      )}

      {latest && (
        <AnimatedSection>
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-serif text-xl font-bold text-navy dark:text-white">
                Your membership applications
              </h2>
              <span className="font-mono text-xs text-text-light dark:text-white/40">
                {applications?.length} total
              </span>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-white/10">
              {applications?.map((application) => (
                <li
                  key={application.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-navy dark:text-white text-sm">
                      {application.startupName || "Membership application"}
                    </span>
                    <span className="block font-mono text-xs text-text-light dark:text-white/40">
                      {application.id} ·{" "}
                      {formatDate(application.submittedAt)}
                    </span>
                    {application.status === "Approved" &&
                      application.meeting && (
                        <span className="block text-xs text-orange mt-1 font-medium">
                          Meeting: {formatDate(application.meeting.at)}
                          {application.meeting.link
                            ? ` · ${application.meeting.link}`
                            : ""}
                        </span>
                      )}
                  </span>
                  <StatusBadge status={application.status} />
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection>
        <div className="bg-navy dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-10">
          <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
            Startup Membership
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
            Building a startup at ACET?
          </h2>
          <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
            Membership is open to students actively working on at least one
            startup. Apply with your venture details and the E-Cell team will
            verify your eligibility.
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
          >
            Go to membership form
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-6">
          Explore BLIEVE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memberQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A2E] hover:border-orange/40 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                <link.Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-navy dark:text-white group-hover:text-orange transition-colors">
                  {link.label}
                </span>
                <span className="block text-sm text-text-grey dark:text-gray-400 mt-0.5">
                  {link.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <HelpCard email={email} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ADMIN                                                              */
/* ------------------------------------------------------------------ */

function AdminHero({
  name,
  title,
  avatar,
}: {
  name: string;
  title: string;
  avatar: string;
}) {
  return (
    <section className="bg-surface dark:bg-[#0B0B14] pt-32 lg:pt-40 pb-16 lg:pb-20 border-b border-orange/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-wrap items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl bg-navy dark:bg-white/10 text-orange flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <ShieldCheck size={30} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-orange font-medium text-xs mb-1.5 tracking-wider uppercase">
                Administrator Console
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white">
                {name}
              </h1>
              <p className="text-text-grey dark:text-gray-400 text-sm mt-1">
                {title} · signed in as {avatar === "S" ? "admin" : "staff"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
            >
              <ClipboardList size={17} aria-hidden="true" />
              Open membership review console
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 dark:border-white/15 text-navy dark:text-white font-semibold rounded-xl hover:border-orange hover:text-orange transition-colors"
            >
              Back to site
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 dark:border-white/15 text-text-grey dark:text-white/70 font-semibold rounded-xl hover:border-orange hover:text-orange transition-colors"
            >
              <User size={17} aria-hidden="true" />
              Profile
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function AdminBody({ email }: { email: string }) {
  return (
    <>
      <AnimatedSection>
        <div className="bg-navy dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-10">
          <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
            Restricted area
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
            Membership applications
          </h2>
          <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
            Review student startup applications, verify eligibility and record
            decisions. The console is protected by the administrator password —
            this dashboard is only your shortcut into it.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
          >
            Open the console
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-6">
          Manage the site
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adminTools.map((tool) => (
            <Link
              key={tool.href + tool.label}
              href={tool.href}
              className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A2E] hover:border-orange/40 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-navy/5 dark:bg-white/5 text-navy dark:text-white flex items-center justify-center shrink-0 group-hover:bg-orange/10 group-hover:text-orange transition-colors">
                <tool.Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-navy dark:text-white group-hover:text-orange transition-colors">
                  {tool.label}
                </span>
                <span className="block text-sm text-text-grey dark:text-gray-400 mt-0.5">
                  {tool.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-6 md:p-8">
          <h2 className="font-serif text-xl font-bold text-navy dark:text-white mb-4">
            Session
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-text-light dark:text-white/40">Signed in as:</dt>
              <dd className="font-mono text-navy dark:text-white">{email}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-text-light dark:text-white/40">Role:</dt>
              <dd className="font-medium text-navy dark:text-white">Administrator</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-text-light dark:text-white/40">Contact:</dt>
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
    </>
  );
}

/* ------------------------------------------------------------------ */

function HelpCard({ email }: { email: string }) {
  return (
    <AnimatedSection>
      <div className="bg-pale dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 p-6 md:p-8">
        <h2 className="font-serif text-xl font-bold text-navy dark:text-white mb-4">
          Need help?
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-3">
            <dt className="text-text-light dark:text-white/40">
              Faculty Coordinator:
            </dt>
            <dd className="font-medium text-navy dark:text-white">
              Prof. Prakash M
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="text-text-light dark:text-white/40">Email:</dt>
            <dd>
              <a
                href="mailto:president@blieve.in"
                className="font-medium text-orange hover:underline"
              >
                president@blieve.in
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="text-text-light dark:text-white/40">
              Signed in as:
            </dt>
            <dd className="font-mono text-navy dark:text-white">{email}</dd>
          </div>
        </dl>
      </div>
    </AnimatedSection>
  );
}
