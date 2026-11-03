import { logout } from "./clientAuth";

/**
 * Clears BOTH sessions: the member cookie (B-slider auth used by the navbar)
 * and the admin cookie that protects /api/admin/*. Without the second call a
 * signed-out admin could reopen /admin while the cookie was still valid.
 */
export async function signOutEverywhere(): Promise<void> {
  await logout();
  try {
    void fetch("/api/admin/logout", { method: "POST" });
  } catch {
    return;
  }
}
