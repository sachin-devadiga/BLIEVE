/**
 * Client-side demo auth for the main BLIEVE site.
 *
 * Mirrors js/auth.js on the legacy static pages: two account types only
 * (Admin and Member), sessions kept in localStorage. This is a demo login —
 * credentials live in the bundle and nothing is verified server-side.
 * Wire a real backend before handling real credentials.
 */

export type Session = {
  email: string;
  name: string;
  role: "admin" | "member";
  title: string;
  avatar: string;
  loginTime: number;
};

type StoredUser = {
  name: string;
  password: string;
  role: "admin" | "member";
  title: string;
  avatar: string;
  joined?: number;
};

export type AuthResult =
  | { success: true; user: Session }
  | { success: false; error: string };

export const AUTH_EVENT = "blieve-auth-change";

const SESSION_KEY = "blieve-session";
const USERS_KEY = "blieve-users";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OFFICIAL_USERS: Record<string, StoredUser> = {
  "admin@blieve.in": {
    password: "admin2026",
    name: "Sachin",
    role: "admin",
    title: "Administrator",
    avatar: "S",
  },
  "harshitha@blieve.in": {
    password: "member2026",
    name: "Harshitha A",
    role: "member",
    title: "Member",
    avatar: "HA",
  },
};

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function read(key: string): string | null {
  if (!hasWindow()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — session just won't persist */
  }
}

function remove(key: string): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function readUsers(): Record<string, StoredUser> {
  const raw = read(USERS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, StoredUser>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function emitChange(): void {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function initialsOf(name: string): string {
  const parts = String(name).trim().split(/\s+/);
  const a = (parts[0] || "").charAt(0);
  const b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (a + b).toUpperCase() || "M";
}

function findUser(email: string): StoredUser | null {
  const key = String(email || "").toLowerCase().trim();
  if (OFFICIAL_USERS[key]) return OFFICIAL_USERS[key];
  const stored = readUsers()[key];
  return stored ?? null;
}

let cachedRaw: string | null = null;
let cachedSession: Session | null = null;
let cacheReady = false;

export function getSession(): Session | null {
  const raw = read(SESSION_KEY);
  if (cacheReady && raw === cachedRaw) return cachedSession;
  cacheReady = true;
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Session;
    cachedSession =
      parsed && typeof parsed === "object" && parsed.email ? parsed : null;
  } catch {
    cachedSession = null;
  }
  return cachedSession;
}

/** Stable snapshot for server rendering — no session exists on the server. */
export function getServerSession(): Session | null {
  return null;
}

/** Subscribe to session changes (login/logout) for useSyncExternalStore. */
export function subscribeSession(onChange: () => void): () => void {
  if (!hasWindow()) return () => {};
  window.addEventListener(AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Returns the role for an email without signing in (null if unknown). */
export function lookupRole(email: string): "admin" | "member" | null {
  const user = findUser(email);
  return user ? user.role : null;
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}

export function login(email: string, password: string): AuthResult {
  const key = String(email || "").toLowerCase().trim();
  const user = findUser(key);
  if (!user) {
    return { success: false, error: "No account found with this email." };
  }
  if (user.password !== password) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  const session: Session = {
    email: key,
    name: user.name,
    role: user.role,
    title: user.title,
    avatar: user.avatar,
    loginTime: Date.now(),
  };
  write(SESSION_KEY, JSON.stringify(session));
  emitChange();
  return { success: true, user: session };
}

export function register(
  name: string,
  email: string,
  password: string
): AuthResult {
  const key = String(email || "").toLowerCase().trim();
  const cleanName = String(name || "").trim();

  if (cleanName.length < 2) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!EMAIL_RE.test(key)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }
  if (findUser(key)) {
    return {
      success: false,
      error: "An account with this email already exists. Try signing in.",
    };
  }

  const users = readUsers();
  users[key] = {
    name: cleanName,
    password,
    role: "member",
    title: "Community Member",
    avatar: initialsOf(cleanName),
    joined: Date.now(),
  };
  write(USERS_KEY, JSON.stringify(users));

  const session: Session = {
    email: key,
    name: cleanName,
    role: "member",
    title: "Community Member",
    avatar: initialsOf(cleanName),
    loginTime: Date.now(),
  };
  write(SESSION_KEY, JSON.stringify(session));
  emitChange();
  return { success: true, user: session };
}

export function logout(): void {
  remove(SESSION_KEY);
  emitChange();
}
