"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LogOut,
  Lock,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import {
  getSession,
  getServerSession,
  subscribeSession,
} from "@/lib/clientAuth";
import { signOutEverywhere } from "@/lib/signOut";
import { apiUrl } from "@/lib/api";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type ApplicationSummary,
  type MembershipApplication,
} from "@/lib/membership/options";

const inputClass =
  "w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all disabled:opacity-60";

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

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-text-light dark:text-white/40">
        {label}
      </dt>
      <dd className="text-sm text-navy dark:text-white whitespace-pre-wrap break-words">
        {value}
      </dd>
    </div>
  );
}

function ChipList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-text-light dark:text-white/40">{empty}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-semibold"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AdminClient() {
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession
  );
  const [phase, setPhase] = useState<"loading" | "login" | "dashboard">(
    "loading"
  );
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [summaries, setSummaries] = useState<ApplicationSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [selected, setSelected] = useState<MembershipApplication | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [patchStatus, setPatchStatus] = useState<ApplicationStatus>(
    "Pending Review"
  );
  const [patchNotes, setPatchNotes] = useState("");
  const [meetingAt, setMeetingAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const response = await fetch(apiUrl("/api/admin/applications"), {
        cache: "no-store",
        credentials: "include",
      });
      if (response.status === 401) {
        setPhase("login");
        return;
      }
      if (!response.ok) throw new Error("request failed");
      const data = (await response.json()) as {
        applications?: ApplicationSummary[];
      };
      setSummaries(data.applications ?? []);
      setPhase("dashboard");
    } catch {
      setListError("Could not load applications. Please try again.");
    }
    setListLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching server state on mount, an external system
    loadList();
  }, [loadList]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const response = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (response.status === 503) {
        setConfigured(false);
        setLoginError(data.error ?? "Admin login is not configured.");
        return;
      }
      if (!response.ok) {
        setLoginError(data.error ?? "Incorrect password.");
        return;
      }
      setPassword("");
      await loadList();
    } catch {
      setLoginError("Something went wrong. Please try again.");
    }
    setLoggingIn(false);
  };

  const openApplication = async (id: string) => {
    setDetailLoading(true);
    setSaveMessage(null);
    setSaveError(null);
    setSelected(null);
    try {
      const response = await fetch(apiUrl(`/api/admin/applications/${id}`), {
        cache: "no-store",
        credentials: "include",
      });
      if (response.status === 401) {
        setPhase("login");
        return;
      }
      if (!response.ok) throw new Error("request failed");
      const data = (await response.json()) as {
        application?: MembershipApplication;
      };
      if (data.application) {
        setSelected(data.application);
        setPatchStatus(data.application.status);
        setPatchNotes(data.application.reviewNotes);
        setMeetingAt(
          data.application.meeting?.at
            ? toDatetimeLocalValue(data.application.meeting.at)
            : ""
        );
        setMeetingLink(data.application.meeting?.link ?? "");
        setMeetingNotes(data.application.meeting?.notes ?? "");
      }
    } catch {
      setSaveError("Could not load that application.");
    }
    setDetailLoading(false);
  };

  const saveChanges = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const response = await fetch(apiUrl(`/api/admin/applications/${selected.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: patchStatus,
          reviewNotes: patchNotes,
          meeting:
            meetingAt.trim().length > 0
              ? { at: meetingAt, link: meetingLink, notes: meetingNotes }
              : null,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        application?: MembershipApplication;
      };
      if (response.status === 401) {
        setPhase("login");
        return;
      }
      if (!response.ok || !data.application) {
        setSaveError(data.error ?? "Could not save changes.");
        return;
      }
      setSelected(data.application);
      setSummaries((previous) =>
        previous.map((item) =>
          item.id === data.application!.id
            ? { ...item, status: data.application!.status }
            : item
        )
      );
      setSaveMessage("Changes saved.");
    } catch {
      setSaveError("Could not save changes. Please try again.");
    }
    setSaving(false);
  };

  const filtered = summaries.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (!query.trim()) return true;
    const needle = query.trim().toLowerCase();
    return [item.fullName, item.usn, item.department, item.startupName]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  const counts = APPLICATION_STATUSES.reduce(
    (accumulator, status) => {
      accumulator[status] = summaries.filter(
        (item) => item.status === status
      ).length;
      return accumulator;
    },
    {} as Record<ApplicationStatus, number>
  );

  if (session && session.role === "member") {
    return (
      <section className="min-h-screen bg-navy dark:bg-[#080F24] flex items-center justify-center px-4 py-28">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-orange/15 text-orange flex items-center justify-center">
            <Lock size={26} aria-hidden="true" />
          </span>
          <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
            Administrator Access Only
          </p>
          <h1 className="font-serif text-3xl font-bold text-white mb-4">
            You do not have access
          </h1>
          <p className="text-white/60 leading-relaxed mb-3">
            You are signed in as{" "}
            <span className="text-white font-semibold">{session.name}</span> — a{" "}
            <span className="text-white font-semibold">Member</span> account. The
            membership review console is restricted to BLIEVE administrators.
          </p>
          <p className="text-white/40 text-sm mb-8">
            Members get their own dashboard with programmes, events and
            membership options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
            >
              Go to my dashboard
              <ArrowLeft size={16} aria-hidden="true" className="rotate-180" />
            </Link>
            <button
              type="button"
              onClick={() => {
                void signOutEverywhere();
                setPhase("login");
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-surface dark:bg-[#0B0B14] flex items-center justify-center">
        <Loader2
          size={28}
          aria-hidden="true"
          className="animate-spin text-orange"
        />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (phase === "login") {
    return (
      <section className="min-h-screen bg-navy dark:bg-[#080F24] flex items-center justify-center px-4 py-28">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-orange font-medium text-sm mb-3 tracking-wider uppercase">
              BLIEVE E-Cell
            </p>
            <h1 className="font-serif text-3xl font-bold text-white">
              Administrator Sign In
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Membership application review console
            </p>
          </div>
          <form
            onSubmit={handleLogin}
            className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-white/10 p-6 md:p-8 space-y-5"
          >
            {loginError && (
              <div
                role="alert"
                className={`rounded-xl px-4 py-3 text-sm ${
                  configured
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                }`}
              >
                {loginError}
              </div>
            )}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-navy dark:text-white mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={loggingIn}
                className={inputClass}
                placeholder="Enter the administrator password"
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn || !password}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
            >
              {loggingIn ? (
                <>
                  <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <p className="text-xs text-text-light dark:text-white/40 leading-relaxed">
              Access is restricted to authorised BLIEVE E-Cell administrators.
              This console requires the{" "}
              <code className="font-mono">ADMIN_PASSWORD</code> environment
              variable to be configured on the server.
            </p>
          </form>
        </div>
      </section>
    );
  }

  if (selected || detailLoading) {
    return (
      <section className="min-h-screen bg-surface dark:bg-[#0B0B14] pt-32 lg:pt-40 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-grey dark:text-gray-400 hover:text-orange mb-6"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to applications
          </button>

          {detailLoading && !selected && (
            <div className="flex items-center gap-3 text-text-grey dark:text-gray-400">
              <Loader2 size={20} aria-hidden="true" className="animate-spin" />
              Loading application...
            </div>
          )}

          {selected && (
            <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="bg-navy dark:bg-[#151528] px-6 py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-white/50 mb-1">
                      {selected.id}
                    </p>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
                      {selected.personal.fullName}
                    </h1>
                    <p className="text-white/60 text-sm mt-1">
                      {selected.personal.usn} · {selected.personal.department} ·{" "}
                      {selected.personal.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={selected.status} />
                    <p className="text-white/50 text-xs mt-2">
                      Submitted {formatDate(selected.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <h2 className="font-serif text-lg font-bold text-navy dark:text-white mb-4">
                    Personal Information
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow label="Full Name" value={selected.personal.fullName} />
                    <DetailRow label="USN" value={selected.personal.usn} />
                    <DetailRow label="Department" value={selected.personal.department} />
                    <DetailRow label="Year of Study" value={selected.personal.year} />
                    <DetailRow label="Contact Number" value={selected.personal.phone} />
                    <DetailRow label="College Email" value={selected.personal.email} />
                  </dl>
                </div>

                <div>
                  <h2 className="font-serif text-lg font-bold text-navy dark:text-white mb-4">
                    Startup Information
                  </h2>
                  <div className="space-y-5">
                    {selected.startups.map((startup, index) => (
                      <div
                        key={`${startup.name}-${index}`}
                        className="border border-gray-100 dark:border-white/10 rounded-2xl p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <h3 className="font-semibold text-navy dark:text-white">
                            {index + 1}. {startup.name}
                          </h3>
                          <span className="px-3 py-1 rounded-full bg-pale dark:bg-white/5 text-xs font-semibold text-navy dark:text-white">
                            {startup.stage}
                          </span>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <DetailRow label="Your Role" value={startup.role} />
                          <DetailRow label="Duration" value={startup.duration} />
                          <DetailRow label="Team Members" value={startup.teamSize} />
                          <DetailRow
                            label="Online Presence"
                            value={
                              startup.hasOnlinePresence
                                ? `Yes${startup.links ? ` — ${startup.links}` : ""}`
                                : "No"
                            }
                          />
                          <div className="sm:col-span-2">
                            <DetailRow
                              label="Startup Description"
                              value={startup.description}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <DetailRow
                              label="Progress So Far"
                              value={startup.progress}
                            />
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-lg font-bold text-navy dark:text-white mb-4">
                    Skills &amp; Contributions
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-light dark:text-white/40 mb-2">
                        Skills
                      </p>
                      <ChipList items={selected.skills} empty="None provided" />
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailRow
                        label="Hours per week"
                        value={selected.hoursPerWeek}
                      />
                      <DetailRow label="Contribution" value={selected.contribution} />
                      <div className="sm:col-span-2">
                        <DetailRow
                          label="Current challenges"
                          value={selected.challenges}
                        />
                      </div>
                    </dl>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-lg font-bold text-navy dark:text-white mb-4">
                    BLIEVE E-Cell Membership
                  </h2>
                  <div className="space-y-4">
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-text-light dark:text-white/40">
                          Why join BLIEVE E-Cell
                        </dt>
                        <dd className="text-sm text-navy dark:text-white whitespace-pre-wrap">
                          {selected.whyJoin}
                        </dd>
                      </div>
                    </dl>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-light dark:text-white/40 mb-2">
                        Expectations
                      </p>
                      <ChipList
                        items={selected.expectations}
                        empty="None selected"
                      />
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailRow
                        label="Willing to participate"
                        value={selected.willingToParticipate ? "Yes" : "No"}
                      />
                      <DetailRow
                        label="Follows rules and guidelines"
                        value={selected.agreesToRules ? "Yes" : "No"}
                      />
                      <DetailRow
                        label="Confirmed active startup"
                        value={selected.confirmsStartup ? "Yes" : "No"}
                      />
                      <DetailRow
                        label="Declaration accepted"
                        value={selected.declarationAccepted ? "Yes" : "No"}
                      />
                    </dl>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                  <h2 className="font-serif text-lg font-bold text-navy dark:text-white mb-4">
                    Review
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="review-status"
                        className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                      >
                        Application Status
                      </label>
                      <select
                        id="review-status"
                        value={patchStatus}
                        onChange={(event) =>
                          setPatchStatus(
                            event.target.value as ApplicationStatus
                          )
                        }
                        disabled={saving}
                        className={inputClass}
                      >
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="review-notes"
                        className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                      >
                        Internal Review Notes
                      </label>
                      <textarea
                        id="review-notes"
                        value={patchNotes}
                        onChange={(event) => setPatchNotes(event.target.value)}
                        rows={4}
                        maxLength={2000}
                        disabled={saving}
                        className={`${inputClass} resize-none`}
                        placeholder="Visible to administrators only..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100 dark:border-white/10 pt-6">
                    <h3 className="font-serif text-base font-bold text-navy dark:text-white mb-1.5">
                      Meeting with the E-Cell team
                    </h3>
                    <p className="text-xs text-text-light dark:text-white/40 mb-4">
                      Shown on the member dashboard once this application is
                      Approved. Leave the date empty to clear the meeting.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="meeting-at"
                          className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                        >
                          Date &amp; time
                        </label>
                        <input
                          id="meeting-at"
                          type="datetime-local"
                          value={meetingAt}
                          onChange={(event) =>
                            setMeetingAt(event.target.value)
                          }
                          disabled={saving}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="meeting-link"
                          className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                        >
                          Venue or online link
                        </label>
                        <input
                          id="meeting-link"
                          type="text"
                          value={meetingLink}
                          onChange={(event) =>
                            setMeetingLink(event.target.value)
                          }
                          maxLength={300}
                          disabled={saving}
                          className={inputClass}
                          placeholder="E-Cell room 208 or https://meet.google.com/..."
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="meeting-notes"
                          className="block text-sm font-medium text-navy dark:text-white mb-1.5"
                        >
                          Message for the member
                        </label>
                        <textarea
                          id="meeting-notes"
                          value={meetingNotes}
                          onChange={(event) =>
                            setMeetingNotes(event.target.value)
                          }
                          rows={3}
                          maxLength={1000}
                          disabled={saving}
                          className={`${inputClass} resize-none`}
                          placeholder="What to prepare, whom to meet, agenda..."
                        />
                      </div>
                    </div>
                  </div>

                  <div aria-live="polite" className="mt-4">
                    {saveMessage && (
                      <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle2 size={16} aria-hidden="true" />
                        {saveMessage}
                      </p>
                    )}
                    {saveError && (
                      <p
                        role="alert"
                        className="text-sm text-red-700 dark:text-red-400"
                      >
                        {saveError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={saving}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={16}
                          aria-hidden="true"
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-surface dark:bg-[#0B0B14] pt-32 lg:pt-40 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
              BLIEVE E-Cell
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy dark:text-white">
              Membership Applications
            </h1>
            <p className="text-text-grey dark:text-gray-400 text-sm mt-2">
              {summaries.length} application{summaries.length === 1 ? "" : "s"}{" "}
              on record
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadList}
              disabled={listLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/15 text-sm font-semibold text-navy dark:text-white rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                aria-hidden="true"
                className={listLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-orange-light transition-colors"
            >
              <User size={15} aria-hidden="true" />
              Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {APPLICATION_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
              aria-pressed={statusFilter === status}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                statusFilter === status
                  ? "border-orange bg-orange/5"
                  : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A2E] hover:border-gray-200 dark:hover:border-white/20"
              }`}
            >
              <p className="font-mono text-2xl font-semibold text-navy dark:text-white">
                {counts[status] ?? 0}
              </p>
              <p className="text-xs text-text-light dark:text-white/40 mt-1">
                {status}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light"
            />
            <label htmlFor="admin-search" className="sr-only">
              Search applications
            </label>
            <input
              id="admin-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`${inputClass} pl-10`}
              placeholder="Search by name, USN, department, or startup"
            />
          </div>
          <label htmlFor="admin-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="admin-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={`${inputClass} sm:w-56`}
          >
            <option value="All">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {listError && (
          <div
            role="alert"
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-6"
          >
            {listError}
          </div>
        )}

        <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
          {listLoading && summaries.length === 0 ? (
            <div className="flex items-center justify-center gap-3 p-10 text-text-grey dark:text-gray-400">
              <Loader2 size={20} aria-hidden="true" className="animate-spin" />
              Loading applications...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-text-grey dark:text-gray-400">
              No applications match your search.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-white/10">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openApplication(item.id)}
                    className="w-full text-left px-5 py-4 hover:bg-surface dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-semibold text-navy dark:text-white">
                        {item.fullName}
                      </span>
                      <span className="font-mono text-xs text-text-light dark:text-white/40">
                        {item.usn}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-1.5 text-sm text-text-grey dark:text-gray-400">
                      {item.startupName || "No startup name"}
                      {item.stage ? ` · ${item.stage}` : ""}
                    </div>
                    <div className="mt-1 text-xs text-text-light dark:text-white/40 flex flex-wrap gap-x-3">
                      <span>{item.department}</span>
                      <span>{item.id}</span>
                      <span>{formatDate(item.submittedAt)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
