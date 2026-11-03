import { logout } from "./clientAuth";

/**
 * Clears BOTH sessions: the client-side demo identity used by the navbar and
 * the HMAC admin cookie that protects /api/admin/*. Without the second call a
 * signed-out admin could reopen /admin while the cookie was still valid.
 */
export function signOutEverywhere(): void {
  logout();
  try {
    void fetch("/api/admin/logout", { method: "POST" });
  } catch {
    return;
  }
}
