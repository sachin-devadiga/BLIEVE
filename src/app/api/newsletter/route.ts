import { NextRequest, NextResponse } from "next/server";
import { str, isValidEmail, isHoneypotTriggered, wantsJson } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { getCollections } from "@/lib/db/mongodb";

/**
 * Subscriptions survive serverless invocations: the email is upserted into
 * MongoDB with a unique index, so duplicate protection is durable too —
 * the in-memory cache below is only an extra fast-path for bursts on a
 * single warm instance.
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

  try {
    const collections = await getCollections();
    await collections.newsletterSubscribers.updateOne(
      { email },
      { $setOnInsert: { email, createdAt: new Date().toISOString() } },
      { upsert: true }
    );
  } catch (error) {
    console.error("[newsletter] failed to store subscription", error);
    return NextResponse.json(
      {
        error:
          "We could not subscribe you right now. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  console.log("[newsletter] stored", { email });

  return NextResponse.json(
    { success: true, message: "Subscribed successfully" },
    { status: 200 }
  );
}
