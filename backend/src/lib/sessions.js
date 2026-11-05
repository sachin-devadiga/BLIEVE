import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "../config.js";

/**
 * Signed httpOnly session cookies, shared design for both session types:
 *  - Member sessions  ("blieve_member"): issued by /api/auth/* on signup/login
 *  - Admin sessions   ("blieve_admin"):  issued by /api/admin/login (env password)
 * Tokens are self-contained HMAC-signed payloads; no server-side session store.
 */

export const MEMBER_SESSION_COOKIE = "blieve_member";
export const ADMIN_SESSION_COOKIE = "blieve_admin";

export const MEMBER_TTL_SECONDS = 24 * 60 * 60;
export const ADMIN_TTL_SECONDS = 8 * 60 * 60;

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

/* ------------------------------ member ------------------------------ */

export function isMemberSessionConfigured() {
  return config.sessionSecret.length > 0;
}

export function createMemberToken(member) {
  const encoded = Buffer.from(
    JSON.stringify({
      email: member.email,
      name: member.name,
      title: member.title,
      issuedAt: Date.now(),
    })
  ).toString("base64url");
  const expiry = String(Date.now() + MEMBER_TTL_SECONDS * 1000);
  return `${encoded}.${expiry}.${sign(`${encoded}.${expiry}`, config.sessionSecret)}`;
}

export function readMemberPayload(token) {
  if (!token || !isMemberSessionConfigured()) return null;
  const first = token.indexOf(".");
  if (first <= 0) return null;
  const encoded = token.slice(0, first);
  const remainder = token.slice(first + 1);
  const second = remainder.indexOf(".");
  if (second <= 0) return null;
  const expiry = remainder.slice(0, second);
  const signature = remainder.slice(second + 1);

  let payload;
  try {
    payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );
  } catch {
    return null;
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.title !== "string" ||
    typeof payload.issuedAt !== "number"
  ) {
    return null;
  }

  const expected = sign(`${encoded}.${expiry}`, config.sessionSecret);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  const timestamp = Number(expiry);
  if (!Number.isFinite(timestamp) || Date.now() > timestamp) return null;
  return payload;
}

/* ------------------------------ admin ------------------------------- */

export function isAdminConfigured() {
  return config.adminPassword.length > 0;
}

function adminKey() {
  return createHmac("sha256", "blieve-admin-session/v1")
    .update(config.adminPassword)
    .digest();
}

export function createAdminToken() {
  if (!isAdminConfigured()) return null;
  const expiry = String(Date.now() + ADMIN_TTL_SECONDS * 1000);
  const signature = createHmac("sha256", adminKey()).update(expiry).digest("hex");
  return `${expiry}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || !isAdminConfigured()) return false;
  const separator = token.indexOf(".");
  if (separator <= 0) return false;
  const expiry = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = createHmac("sha256", adminKey()).update(expiry).digest("hex");
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }
  const timestamp = Number(expiry);
  return Number.isFinite(timestamp) && Date.now() <= timestamp;
}

export function adminPasswordMatches(input) {
  if (!config.adminPassword) return false;
  const candidate = createHmac("sha256", "blieve-admin-password/v1")
    .update(input)
    .digest();
  const expected = createHmac("sha256", "blieve-admin-password/v1")
    .update(config.adminPassword)
    .digest();
  return timingSafeEqual(candidate, expected);
}

/* ------------------------------ cookies ----------------------------- */

export function cookieOptions(req, maxAge) {
  // trust proxy is enabled in index.js so req.secure respects X-Forwarded-Proto.
  // res.cookie() maxAge is in milliseconds; callers pass seconds, so convert.
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAge * 1000,
    secure: Boolean(req.secure),
  };
}

export function clearCookieOptions(req) {
  return { ...cookieOptions(req, 0), maxAge: 0, expires: new Date(0) };
}

export function isAdmin(req) {
  return verifyAdminToken(req.cookies?.[ADMIN_SESSION_COOKIE]);
}
