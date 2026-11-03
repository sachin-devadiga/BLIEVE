import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, clearCookieOptions } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", clearCookieOptions(request));
  return response;
}
