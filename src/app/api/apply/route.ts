import { NextRequest, NextResponse } from "next/server";
import {
  str,
  LIMITS,
  isValidEmail,
  isHoneypotTriggered,
  wantsJson,
} from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const VALID_TYPES = ["student", "mentor", "sponsor"];

export async function POST(request: NextRequest) {
  if (!wantsJson(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  if (!rateLimit(`apply:${clientIp(request)}`, 5, 60_000)) {
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

  // Honeypot tripped: treat as accepted so bots cannot adapt, but drop it.
  if (isHoneypotTriggered(body)) {
    return NextResponse.json(
      { success: true, message: "Application received" },
      { status: 200 }
    );
  }

  const name = str(body.name, LIMITS.name);
  const email = str(body.email, LIMITS.email);
  const phone = str(body.phone, LIMITS.phone);
  const year = str(body.year, LIMITS.type);
  const message = str(body.message, LIMITS.message);
  const type = str(body.type, LIMITS.type);
  const expertise = str(body.expertise, LIMITS.message);
  const organisation = str(body.organisation, LIMITS.name);

  if (!name || !email || !message || !type) {
    return NextResponse.json(
      { error: "Name, email, message and application type are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid application type." }, { status: 400 });
  }

  // NOTE: console.log is the delivery channel until a real email/DB provider
  // is configured — submissions are NOT durably stored. Log contains the
  // submission itself because delivering it is the purpose of this endpoint.
  console.log("[apply]", {
    type,
    name,
    email,
    phone,
    year,
    expertise,
    organisation,
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json(
    { success: true, message: "Application received successfully" },
    { status: 200 }
  );
}
