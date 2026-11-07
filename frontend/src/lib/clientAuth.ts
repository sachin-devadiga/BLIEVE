import { initialsOf } from "@/lib/initials";
import { apiUrl } from "@/lib/api";

/**
 * Client session layer for the BLIEVE member/admin auth.
 *
 * Sessions are httpOnly cookies verified server-side (see memberAuth.ts +
 * /api/auth/*). This module is only a thin client store around
 * GET /api/auth/session so components can render from useSyncExternalStore.
 */

export type Session = {
  email: string;
  name: string;
  role: "admin" | "member";
  title: string;
  avatar: string;
  loginTime: number;
};

type ApiUser = {
  email: string;
  name: string;
  title: string;
  role?: "admin" | "member";
};

type SessionApi = {
  session: {
    email: string;
    name: string;
    role: "admin" | "member";
    title: string;
    loginTime: number;
  } | null;
};

export type AuthResult =
  | { success: true; user: Session }
  | { success: false; error: string };

export const AUTH_EVENT = "blieve-auth-change";

export function hasWindow(): boolean {
  return typeof window !== "undefined";
}

let cachedSession: Session | null = null;

export function getSession(): Session | null {
  return cachedSession;
}

/** Stable snapshot for server rendering — no session exists on the server. */
export function getServerSession(): Session | null {
  return null;
}

export function subscribeSession(onChange: () => void): () => void {
  if (!hasWindow()) return () => {};
  // Kick off the initial server round-trip once a reader attaches so the
  // navbar/authed pages pick up the cookie without a page reload.
  void refreshSession();
  window.addEventListener(AUTH_EVENT, onChange);
  return () => window.removeEventListener(AUTH_EVENT, onChange);
}

export function setClientSession(session: Session | null): void {
  cachedSession = session ? { ...session } : null;
  emitChange();
}

export function isAdmin(): boolean {
  return cachedSession?.role === "admin";
}

export function isLoggedIn(): boolean {
  return cachedSession !== null;
}

function emitChange(): void {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function toSession(
  user: { email: string; name: string; title: string },
  role: "admin" | "member" = "member",
  loginTime = Date.now()
): Session {
  return {
    email: user.email,
    name: user.name,
    role,
    title: user.title,
    avatar: initialsOf(user.name),
    loginTime,
  };
}

export async function refreshSession(): Promise<Session | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = requestSession().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

let refreshPromise: Promise<Session | null> | null = null;

async function requestSession(): Promise<Session | null> {
  try {
    const response = await fetch(apiUrl("/api/auth/session"), {
      cache: "no-store",
      credentials: "include",
    });
    if (!response.ok) return cachedSession;
    const data = (await response.json()) as SessionApi;
    const session = data.session
      ? toSession(data.session, data.session.role, data.session.loginTime)
      : null;
    if (session || cachedSession) setClientSession(session);
    return session;
  } catch {
    return cachedSession;
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const response = await safePost("/api/auth/login", { email, password });
  if (!response.ok) {
    return {
      success: false,
      error:
        response.error ||
        "Could not sign in. Please try again in a moment.",
    };
  }
  const session = toSession(
    response.user,
    response.user.role ?? "member"
  );
  setClientSession(session);
  return { success: true, user: session };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const response = await safePost("/api/auth/register", {
    name,
    email,
    password,
  });
  if (!response.ok) {
    return {
      success: false,
      error:
        response.error ||
        "Could not create the account. Please try again in a moment.",
    };
  }
  const session = toSession(
    response.user,
    response.user.role ?? "member"
  );
  setClientSession(session);
  return { success: true, user: session };
}

export async function logout(): Promise<void> {
  try {
    await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
  } catch {
    /* session cookie will expire naturally if the request fails */
  }
  setClientSession(null);
}

type PostResponse =
  | { ok: true; user: ApiUser }
  | { ok: false; error?: string };

async function safePost(
  url: string,
  payload: Record<string, string>
): Promise<PostResponse> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    let body: { user?: ApiUser; error?: string } | null = null;
    try {
      body = (await response.json()) as { user?: ApiUser; error?: string };
    } catch {
      /* non-JSON error */
    }
    if (!response.ok) {
      return { ok: false, error: body?.error };
    }
    if (!body?.user) return { ok: false };
    return { ok: true, user: body.user };
  } catch {
    return { ok: false };
  }
}

export { initialsOf };
