import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Server-side member sessions, sent as an HMAC-signed httpOnly cookie.
 * Reuses the same signed-expiry design as adminAuth but with its own
 * cookie, salt and secret so the two session types stay independent.
 */

export const MEMBER_SESSION_COOKIE = "blieve_member";
const SESSION_TTL_SECONDS = 24 * 60 * 60;

type MemberSessionPayload = {
  email: string;
  name: string;
  title: string;
  issuedAt: number;
};

function sessionSecret(): string {
  return (
    process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || ""
  );
}

export function isSessionSecretConfigured(): boolean {
  return sessionSecret().length > 0;
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function isMemberSession(token: string | undefined | null): boolean {
  const payload = readSessionPayload(token);
  return payload !== null;
}

export function readSessionPayload(
  token: string | undefined | null
): MemberSessionPayload | null {
  if (!token || !isSessionSecretConfigured()) return null;
  const first = token.indexOf(".");
  if (first <= 0) return null;
  const encoded = token.slice(0, first);
  const remainder = token.slice(first + 1);
  const second = remainder.indexOf(".");
  if (second <= 0) return null;
  const expiry = remainder.slice(0, second);
  const signature = remainder.slice(second + 1);

  let payload: MemberSessionPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as MemberSessionPayload;
  } catch {
    return null;
  }
  if (
    typeof payload.email !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.title !== "string" ||
    typeof payload.issuedAt !== "number"
  ) {
    return null;
  }

  const expected = sign(`${encoded}.${expiry}`);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  const timestamp = Number(expiry);
  if (!Number.isFinite(timestamp) || Date.now() > timestamp) return null;
  return payload;
}

export function createSessionToken(member: {
  email: string;
  name: string;
  title: string;
}): string {
  const encoded = Buffer.from(
    JSON.stringify({
      email: member.email,
      name: member.name,
      title: member.title,
      issuedAt: Date.now(),
    } satisfies MemberSessionPayload)
  ).toString("base64url");
  const expiry = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${encoded}.${expiry}.${sign(`${encoded}.${expiry}`)}`;
}

export function cookieOptions(request: NextRequest) {
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
