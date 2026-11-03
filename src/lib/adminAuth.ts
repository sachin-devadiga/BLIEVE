import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "blieve_admin";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function hmac(value: string, salt: string): Buffer {
  return createHmac("sha256", salt).update(value).digest();
}

function sessionKey(): Buffer {
  return hmac(process.env.ADMIN_PASSWORD ?? "", "blieve-admin-session/v1");
}

function signExpiry(expiry: string): string {
  return createHmac("sha256", sessionKey()).update(expiry).digest("hex");
}

export function isAdminConfigured(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length > 0;
}

export function passwordMatches(input: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return timingSafeEqual(
    hmac(input, "blieve-admin-password/v1"),
    hmac(configured, "blieve-admin-password/v1")
  );
}

export function createSessionToken(): string | null {
  if (!isAdminConfigured()) return null;
  const expiry = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${expiry}.${signExpiry(expiry)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !isAdminConfigured()) return false;
  const separator = token.indexOf(".");
  if (separator <= 0) return false;
  const expiry = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = signExpiry(expiry);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  const timestamp = Number(expiry);
  return Number.isFinite(timestamp) && Date.now() <= timestamp;
}

export function sessionCookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    secure: request.nextUrl.protocol === "https:",
  };
}

export function clearCookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    secure: request.nextUrl.protocol === "https:",
  };
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
