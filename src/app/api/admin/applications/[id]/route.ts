import { NextRequest, NextResponse } from "next/server";
import { str, wantsJson } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { requireAdmin } from "@/lib/adminAuth";
import type { ApplicationStatus } from "@/lib/membership/options";
import {
  getApplication,
  isApplicationStatus,
  updateApplication,
} from "@/lib/db/applications";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const application = await getApplication(id);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  return NextResponse.json({ application }, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  if (!wantsJson(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  if (!rateLimit(`admin-update:${clientIp(request)}`, 30, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const patch: { status?: ApplicationStatus; reviewNotes?: string } = {};
  if (body.status !== undefined) {
    if (!isApplicationStatus(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (body.reviewNotes !== undefined) {
    patch.reviewNotes = str(body.reviewNotes, 2000);
  }
  if (patch.status === undefined && patch.reviewNotes === undefined) {
    return NextResponse.json(
      { error: "Nothing to update." },
      { status: 400 }
    );
  }

  const application = await updateApplication(id, patch);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  return NextResponse.json({ application }, { status: 200 });
}
