import { NextRequest, NextResponse } from "next/server";
import { isHoneypotTriggered, wantsJson } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { validateMembership } from "@/lib/membership/validate";
import { insertApplication } from "@/lib/db/applications";
import { randomBytes } from "node:crypto";

export async function POST(request: NextRequest) {
  if (!wantsJson(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  if (!rateLimit(`membership:${clientIp(request)}`, 5, 60_000)) {
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
      {
        success: true,
        applicationId: `BLV-${new Date().getFullYear()}-${randomBytes(5)
          .toString("hex")
          .toUpperCase()
          .slice(0, 8)}`,
      },
      { status: 200 }
    );
  }

  const result = validateMembership(body);
  if (!result.ok) {
    const ineligible = Object.keys(result.fieldErrors).length === 0;
    return NextResponse.json(
      { error: result.formError, fieldErrors: result.fieldErrors },
      { status: ineligible ? 422 : 400 }
    );
  }

  let stored;
  try {
    stored = await insertApplication({
      ...result.data,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[membership] failed to store application", error);
    return NextResponse.json(
      {
        error:
          "We could not receive your application right now. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  if (!stored.ok) {
    return NextResponse.json(
      {
        error: `An application from this email and USN is already under review. Your reference ID is ${stored.existingId}.`,
        applicationId: stored.existingId,
      },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { success: true, applicationId: stored.id, status: "Pending Review" },
    { status: 201 }
  );
}
