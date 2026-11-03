import { NextRequest, NextResponse } from "next/server";
import { verifyMemberLogin } from "@/lib/db/users";
import {
  MEMBER_SESSION_COOKIE,
  cookieOptions,
  createSessionToken,
  isSessionSecretConfigured,
} from "@/lib/memberAuth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  if (!isSessionSecretConfigured()) {
    return NextResponse.json(
      { error: "Sign-in is not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  if (!rateLimit(`auth-login:${clientIp(request)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  try {
    const result = await verifyMemberLogin(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    const response = NextResponse.json({ user: result.member });
    response.cookies.set(
      MEMBER_SESSION_COOKIE,
      createSessionToken(result.member),
      cookieOptions(request)
    );
    return response;
  } catch (error) {
    console.error("[auth/login] database unavailable", error);
    return NextResponse.json(
      { error: "Sign-in is unavailable right now. Please try again shortly." },
      { status: 503 }
    );
  }
}

export const runtime = "nodejs";
