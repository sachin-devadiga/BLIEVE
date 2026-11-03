import { randomBytes } from "node:crypto";
import { ObjectId, type WithId } from "mongodb";
import { ensureIndexes, getCollections } from "./mongodb";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type ApplicationSummary,
  type MembershipApplication,
} from "@/lib/membership/options";

type ApplicationDoc = WithId<MembershipApplication>;

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

function stripMongo(doc: ApplicationDoc): MembershipApplication {
  const { _id: _mongoId, ...application } = doc;
  void _mongoId;
  return application;
}

export async function insertApplication(
  input: MembershipApplication
): Promise<{ ok: true; id: string } | { ok: false; existingId: string }> {
  await ensureIndexes();
  const collections = await getCollections();

  const duplicate = await collections.applications.findOne({
    "personal.email": { $regex: `^${escapeRegex(input.personal.email)}$`, $options: "i" },
    "personal.usn": { $regex: `^${escapeRegex(input.personal.usn)}$`, $options: "i" },
    status: { $in: IN_FLIGHT },
  });
  if (duplicate) return { ok: false as const, existingId: duplicate.id };

  const application: MembershipApplication = { ...input, id: generateId() };
  try {
    await collections.applications.insertOne({
      ...application,
      _id: newIdPlaceholder(),
    } as never);
    return { ok: true as const, id: application.id };
  } catch (error) {
    if (isDuplicateKeyId(error)) {
      // Rare insert collision on the unique `id` index – retry once.
      const retry: MembershipApplication = {
        ...application,
        id: generateId(),
      };
      try {
        await collections.applications.insertOne({ ...retry, _id: newIdPlaceholder() } as never);
        return { ok: true as const, id: retry.id };
      } catch (retryError) {
        if (isDuplicateKeyId(retryError)) {
          return { ok: false as const, existingId: retry.id };
        }
        throw retryError;
      }
    }
    throw error;
  }
}

export async function listApplications(options: {
  status?: string;
  query?: string;
}): Promise<ApplicationSummary[]> {
  await ensureIndexes();
  const collections = await getCollections();

  const filter: Record<string, unknown> = {};
  const status = options.status?.trim();
  if (status && status !== "All") {
    filter.status = status;
  }
  const query = options.query?.trim();
  if (query) {
    const rx = new RegExp(escapeRegex(query), "i");
    filter.$or = [
      { "personal.fullName": rx },
      { "personal.usn": rx },
      { "personal.department": rx },
      { "personal.email": rx },
      { "startups.name": rx },
    ];
  }

  const rows = await collections.applications
    .find(filter)
    .sort({ submittedAt: -1 })
    .limit(500)
    .toArray();

  return rows.map((row) => summarise(stripMongo(row)));
}

export async function getApplication(
  id: string
): Promise<MembershipApplication | null> {
  await ensureIndexes();
  const collections = await getCollections();
  const doc = await collections.applications.findOne({ id });
  return doc ? stripMongo(doc) : null;
}

export async function updateApplication(
  id: string,
  patch: { status?: ApplicationStatus; reviewNotes?: string }
): Promise<MembershipApplication | null> {
  await ensureIndexes();
  const collections = await getCollections();

  const current = await collections.applications.findOne({ id });
  if (!current) return null;

  const set: Record<string, unknown> = {};
  if (patch.status && patch.status !== current.status) {
    set.status = patch.status;
    set.reviewedAt = new Date().toISOString();
  }
  if (patch.reviewNotes !== undefined) {
    set.reviewNotes = patch.reviewNotes;
  }

  if (Object.keys(set).length === 0) return stripMongo(current);

  const updated = await collections.applications.findOneAndUpdate(
    { id },
    { $set: set },
    { returnDocument: "after" }
  );
  if (!updated) return null;
  return stripMongo(updated);
}

export async function listApplicationsByEmail(
  email: string
): Promise<MembershipApplication[]> {
  await ensureIndexes();
  const collections = await getCollections();
  const rows = await collections.applications
    .find({
      "personal.email": { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    })
    .sort({ submittedAt: -1 })
    .limit(20)
    .toArray();
  return rows.map((row) => stripMongo(row));
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  );
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDuplicateKeyId(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}

// mongod generates _id server-side when omitted, but the typed collection
// requires an explicit value — creating it via the driver avoids the require hack.
function newIdPlaceholder(): ObjectId {
  return new ObjectId();
}
