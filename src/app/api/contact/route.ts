import { NextRequest, NextResponse } from "next/server";
import { str, LIMITS, isValidEmail, isHoneypotTriggered, wantsJson } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { getCollections } from "@/lib/db/mongodb";

export async function POST(request: NextRequest) {
  if (!wantsJson(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  if (!rateLimit(`contact:${clientIp(request)}`, 5, 60_000)) {
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
      { success: true, message: "Message sent" },
      { status: 200 }
    );
  }

  const name = str(body.name, LIMITS.name);
  const email = str(body.email, LIMITS.email);
  const subject = str(body.subject, LIMITS.subject);
  const message = str(body.message, LIMITS.message);

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Name, email, subject and message are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // Persist durably in MongoDB — messages must survive serverless
  // executions and be answerable from the database.
  try {
    const collections = await getCollections();
    await collections.messages.insertOne({
      kind: "contact",
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    } as never);
  } catch (error) {
    console.error("[contact] failed to store message", error);
    return NextResponse.json(
      {
        error:
          "We could not send your message right now. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  console.log("[contact] stored", { email });

  return NextResponse.json(
    { success: true, message: "Message sent successfully" },
    { status: 200 }
  );
}
