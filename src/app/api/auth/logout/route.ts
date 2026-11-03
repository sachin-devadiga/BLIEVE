import { NextRequest, NextResponse } from "next/server";
import {
  MEMBER_SESSION_COOKIE,
  clearCookieOptions,
} from "@/lib/memberAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    MEMBER_SESSION_COOKIE,
    "",
    clearCookieOptions(request)
  );
  return response;
}
