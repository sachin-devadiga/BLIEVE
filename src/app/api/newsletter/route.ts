import { NextRequest, NextResponse } from "next/server";
import { str, isValidEmail, isHoneypotTriggered, wantsJson } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";

/**
 * Recent-email cache for duplicate-submission protection.
 * In-memory only: resets on redeploy (same limitation as rateLimit).
 */
const recentEmails = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!wantsJson(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  if (!rateLimit(`newsletter:${clientIp(request)}`, 3, 60_000)) {
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

  if (isHoneypotTriggered(body)) {
    return NextResponse.json(
      { success: true, message: "Subscribed" },
      { status: 200 }
    );
  }

  const email = str(body.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }

  const now = Date.now();
  for (const [key, seen] of recentEmails) {
    if (now - seen > DUPLICATE_WINDOW_MS) recentEmails.delete(key);
  }

  if (recentEmails.has(email)) {
    return NextResponse.json(
      { success: true, message: "Already subscribed" },
      { status: 200 }
    );
  }
  recentEmails.set(email, now);

  // NOTE: console.log is the delivery channel until a mailing-list provider
  // (e.g. Resend/Mailchimp) is configured — subscriptions are NOT durably
  // stored. Replace this block when integrating a real provider.
  console.log("[newsletter]", {
    email,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json(
    { success: true, message: "Subscribed successfully" },
    { status: 200 }
  );
}
