"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogIn,
  UserPlus,
  ArrowRight,
  LogOut,
  CheckCircle,
  Check,
} from "lucide-react";
import {
  login,
  register,
  getSession,
  getServerSession,
  subscribeSession,
} from "@/lib/clientAuth";
import { signOutEverywhere } from "@/lib/signOut";
import { siteData } from "@/data/siteData";

type Mode = "signin" | "signup";

const inputClass =
  "w-full px-4 py-3 min-h-11 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all";
const labelClass = "block text-sm font-medium text-navy dark:text-white mb-1.5";

const perks = [
  "Admin and member access in one place",
  "Programmes, events and updates for the BLIEVE community",
  "New here? Create a member account in seconds",
];

export default function LoginClient() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession
  );
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const homeFor = (role: "admin" | "member") =>
    role === "admin" ? "/admin" : "/dashboard";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setDone(`Welcome back, ${result.user.name.split(" ")[0]}.`);
      setTimeout(() => router.push(homeFor(result.user.role)), 700);
    } catch {
      setError("Sign-in failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setDone("Account created — taking you in...");
      setTimeout(() => router.push("/dashboard"), 700);
    } catch {
      setError("Account creation failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    void signOutEverywhere();
    setDone(null);
    setError(null);
    setPassword("");
    setConfirm("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setDone(null);
  };

  return (
    <section className="relative bg-navy dark:bg-[#080F24] min-h-screen pt-28 lg:pt-36 pb-20 overflow-hidden">
      {/* Ambient glow so the navy field is not flat */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-orange/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT — brand panel */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="relative w-14 h-14 rounded-full bg-white ring-1 ring-white/20 overflow-hidden shrink-0">
                <Image
                  src="/blieve-logo.png"
                  alt="BLIEVE E-Cell logo"
                  fill
                  sizes="56px"
                  className="object-contain scale-[1.05]"
                />
              </span>
              <span className="leading-tight">
                <span className="block font-serif text-2xl font-bold text-white">
                  BLI<span className="text-orange">E</span>VE
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  E-Cell &middot; ACET
                </span>
              </span>
            </div>

            <p className="text-orange font-medium text-sm mb-4 tracking-wider uppercase">
              Member Access
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              {mode === "signin" ? "Welcome back." : "Join BLIEVE."}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-white/70 italic mb-8">
              {siteData.tagline}
            </p>

            <ul className="space-y-4">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-orange/15 border border-orange/40 flex items-center justify-center shrink-0">
                    <Check size={13} className="text-orange" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-white/70 leading-relaxed">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — auth card */}
          <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-orange/10 shadow-2xl shadow-black/20 p-6 sm:p-8">
            {session ? (
              <>
                {done && (
                  <div
                    role="status"
                    className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-sm text-green-700 dark:text-green-300 mb-5"
                  >
                    <CheckCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    {done}
                  </div>
                )}
                <div className="text-center py-4">
                  <div
                    className="w-16 h-16 rounded-2xl bg-orange text-white flex items-center justify-center font-serif font-bold text-2xl mx-auto mb-4"
                    aria-hidden="true"
                  >
                    {session.avatar}
                  </div>
                  <p className="text-sm text-text-grey dark:text-gray-400 mb-1">
                    Signed in as
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">
                    {session.name}
                  </h2>
                  <p className="text-orange text-sm font-medium mt-1 mb-6">
                    {session.title}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.push(homeFor(session.role))}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20"
                    >
                      {session.role === "admin"
                        ? "Open admin console"
                        : "Open my dashboard"}
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <button
                      onClick={signOut}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-navy dark:text-white font-semibold rounded-xl hover:border-orange hover:text-orange transition-colors"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-6"
                  role="tablist"
                  aria-label="Authentication"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "signin"}
                    onClick={() => switchMode("signin")}
                    className={`py-2.5 min-h-11 rounded-lg text-sm font-semibold transition-colors ${
                      mode === "signin"
                        ? "bg-orange text-white shadow-sm"
                        : "text-text-grey dark:text-gray-400 hover:text-navy dark:hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "signup"}
                    onClick={() => switchMode("signup")}
                    className={`py-2.5 min-h-11 rounded-lg text-sm font-semibold transition-colors ${
                      mode === "signup"
                        ? "bg-orange text-white shadow-sm"
                        : "text-text-grey dark:text-gray-400 hover:text-navy dark:hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-5"
                  >
                    {error}
                  </div>
                )}

                {mode === "signin" ? (
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                      <label htmlFor="login-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="login-email"
                        className={inputClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@blieve.in"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="login-password" className={labelClass}>
                        Password
                      </label>
                      <input
                        type="password"
                        id="login-password"
                        className={inputClass}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                      <LogIn size={16} aria-hidden="true" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div>
                      <label htmlFor="signup-name" className={labelClass}>
                        Full name
                      </label>
                      <input
                        type="text"
                        id="signup-name"
                        className={inputClass}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="signup-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="signup-email"
                        className={inputClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="signup-password" className={labelClass}>
                        Password
                      </label>
                      <input
                        type="password"
                        id="signup-password"
                        className={inputClass}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="signup-confirm" className={labelClass}>
                        Confirm password
                      </label>
                      <input
                        type="password"
                        id="signup-confirm"
                        className={inputClass}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                      <UserPlus size={16} aria-hidden="true" />
                    </button>
                  </form>
                )}

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10">
                  <p className="text-xs text-text-light dark:text-white/40 leading-relaxed">
                    Administrator accounts use the console at{" "}
                    <Link
                      href="/admin"
                      className="font-semibold text-orange hover:underline"
                    >
                      /admin
                    </Link>
                    . Every session is verified server-side and protected by an
                    httpOnly cookie.
                  </p>
                </div>
              </>
            )}

            <p className="text-center text-sm text-text-grey dark:text-gray-400 mt-6">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-orange font-medium hover:underline"
              >
                Contact the team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
