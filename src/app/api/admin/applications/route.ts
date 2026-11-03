import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listApplications, isApplicationStatus } from "@/lib/db/applications";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const status = request.nextUrl.searchParams.get("status") ?? "";
  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (status && status !== "All" && !isApplicationStatus(status)) {
    return NextResponse.json({ error: "Invalid status filter." }, { status: 400 });
  }

  const applications = await listApplications({ status, query });
  return NextResponse.json(
    { applications, count: applications.length },
    { status: 200 }
  );
}
