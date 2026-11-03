import { NextRequest, NextResponse } from "next/server";
import { MEMBER_SESSION_COOKIE, readSessionPayload } from "@/lib/memberAuth";
import { listApplicationsByEmail } from "@/lib/db/applications";

/** Applications submitted by the signed-in member, keyed to their email. */
export async function GET(request: NextRequest) {
  const payload = readSessionPayload(
    request.cookies.get(MEMBER_SESSION_COOKIE)?.value
  );
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await listApplicationsByEmail(payload.email);
    return NextResponse.json({
      applications: applications.map((application) => ({
        id: application.id,
        submittedAt: application.submittedAt,
        status: application.status,
        startupName: application.startups[0]?.name ?? "",
      })),
    });
  } catch (error) {
    console.error("[auth/my-applications] database unavailable", error);
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}
