/** Shared server-side input validation for form API routes. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  message: 4000,
  subject: 50,
  type: 20,
};

/** Trim, coerce non-strings to "", and hard-cap length. */
export function str(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function isValidEmail(email) {
  return email.length > 0 && email.length <= LIMITS.email && EMAIL_RE.test(email);
}

/** Honeypot: hidden field humans never fill. True if the request looks like a bot. */
export function isHoneypotTriggered(body) {
  return typeof body.website === "string" && body.website.trim() !== "";
}

export function wantsJson(req) {
  const contentType = req.headers["content-type"] || "";
  return contentType.includes("application/json");
}
