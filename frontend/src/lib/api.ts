/**
 * Base URL of the BLIEVE Express backend (Render).
 * - Production: NEXT_PUBLIC_API_URL=https://<service>.onrender.com (or api.blieve.in)
 * - Unset: same-origin fallback, so a locally proxied backend still works.
 */
export function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
}

/** Absolute URL for an API path like /api/auth/session. */
export function apiUrl(path: string): string {
  return `${apiBase()}${path}`;
}
