import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";
import {
  MEMBER_SESSION_COOKIE,
  readSessionPayload,
} from "@/lib/memberAuth";

export type SessionResponse = {
  session: {
    email: string;
    name: string;
    role: "admin" | "member";
    title: string;
    loginTime: number;
  } | null;
};

export async function GET(request: NextRequest) {
  const member = readSessionPayload(
    request.cookies.get(MEMBER_SESSION_COOKIE)?.value
  );
  if (member) {
    return NextResponse.json<SessionResponse>({
      session: {
        email: member.email,
        name: member.name,
        role: "member",
        title: member.title,
        loginTime: member.issuedAt,
      },
    });
  }

  if (verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json<SessionResponse>({
      session: {
        email: process.env.ADMIN_EMAIL || "president@blieve.in",
        name: process.env.ADMIN_NAME || "Administrator",
        role: "admin",
        title: "Administrator",
        loginTime: Date.now(),
      },
    });
  }

  return NextResponse.json<SessionResponse>({ session: null });
}
