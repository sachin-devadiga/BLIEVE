import { NextRequest, NextResponse } from "next/server";
import { str, wantsJson } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  isAdminConfigured,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  if (!wantsJson(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  if (!rateLimit(`admin-login:${clientIp(request)}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin login is not configured. Set the ADMIN_PASSWORD environment variable on the server.",
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const password = str(body.password, 200);
  if (!password || !passwordMatches(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 }
    );
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions(request));
  return response;
}
