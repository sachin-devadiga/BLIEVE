import { randomBytes } from "node:crypto";
import { readStore, writeStore, withStoreLock } from "./store";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type ApplicationSummary,
  type MembershipApplication,
} from "@/lib/membership/options";

function generateId(): string {
  const year = new Date().getFullYear();
  const suffix = randomBytes(5).toString("hex").toUpperCase().slice(0, 8);
  return `BLV-${year}-${suffix}`;
}

function summarise(app: MembershipApplication): ApplicationSummary {
  return {
    id: app.id,
    submittedAt: app.submittedAt,
    status: app.status,
    fullName: app.personal.fullName,
    usn: app.personal.usn,
    department: app.personal.department,
    year: app.personal.year,
    email: app.personal.email,
    phone: app.personal.phone,
    startupName: app.startups[0]?.name ?? "",
    stage: app.startups[0]?.stage ?? "",
  };
}

const IN_FLIGHT: ApplicationStatus[] = ["Pending Review", "Under Review"];

export async function insertApplication(
  input: MembershipApplication
): Promise<{ ok: true; id: string } | { ok: false; existingId: string }> {
  return withStoreLock(async () => {
    const rows = await readStore<MembershipApplication>();

    const duplicate = rows.find(
      (row) =>
        row.personal.email.toLowerCase() === input.personal.email.toLowerCase() &&
        row.personal.usn.toUpperCase() === input.personal.usn.toUpperCase() &&
        IN_FLIGHT.includes(row.status)
    );
    if (duplicate) return { ok: false as const, existingId: duplicate.id };

    let application: MembershipApplication = { ...input, id: generateId() };
    while (rows.some((row) => row.id === application.id)) {
      application = { ...application, id: generateId() };
    }

    rows.push(application);
    await writeStore(rows);
    return { ok: true as const, id: application.id };
  });
}

export async function listApplications(options: {
  status?: string;
  query?: string;
}): Promise<ApplicationSummary[]> {
  const rows = await readStore<MembershipApplication>();
  const status = options.status?.trim();
  const query = options.query?.trim().toLowerCase();

  const filtered = rows.filter((row) => {
    if (status && status !== "All" && row.status !== status) return false;
    if (!query) return true;
    const haystack = [
      row.personal.fullName,
      row.personal.usn,
      row.personal.department,
      row.personal.email,
      ...row.startups.map((startup) => startup.name),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  return filtered
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .map(summarise);
}

export async function getApplication(
  id: string
): Promise<MembershipApplication | null> {
  const rows = await readStore<MembershipApplication>();
  return rows.find((row) => row.id === id) ?? null;
}

export async function updateApplication(
  id: string,
  patch: { status?: ApplicationStatus; reviewNotes?: string }
): Promise<MembershipApplication | null> {
  return withStoreLock(async () => {
    const rows = await readStore<MembershipApplication>();
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return null;

    const current = rows[index];
    const next: MembershipApplication = {
      ...current,
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.reviewNotes !== undefined
        ? { reviewNotes: patch.reviewNotes }
        : {}),
    };
    if (patch.status && patch.status !== current.status) {
      next.reviewedAt = new Date().toISOString();
    }
    rows[index] = next;
    await writeStore(rows);
    return next;
  });
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  );
}
