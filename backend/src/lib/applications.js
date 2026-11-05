import { randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { ensureIndexes, getDb } from "./mongodb.js";
import { APPLICATION_STATUSES } from "./membershipOptions.js";

function generateId() {
  const year = new Date().getFullYear();
  const suffix = randomBytes(5).toString("hex").toUpperCase().slice(0, 8);
  return `BLV-${year}-${suffix}`;
}

function summarise(app) {
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
    startupName: app.startups?.[0]?.name ?? "",
    stage: app.startups?.[0]?.stage ?? "",
  };
}

const IN_FLIGHT = ["Pending Review", "Under Review"];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDuplicateKeyId(error) {
  return typeof error === "object" && error !== null && error.code === 11000;
}

function stripMongo(doc) {
  const { _id, ...application } = doc;
  return application;
}

function hasMeaningfulMeeting(meeting) {
  return Boolean(
    meeting &&
      typeof meeting.at === "string" &&
      meeting.at.trim().length > 0
  );
}

function applicationsCollection() {
  return getDb().then((db) => db.collection("applications"));
}

export async function insertApplication(input) {
  await ensureIndexes();
  const collections = await applicationsCollection();

  const duplicate = await collections.findOne({
    "personal.email": { $regex: `^${escapeRegex(input.personal.email)}$`, $options: "i" },
    "personal.usn": { $regex: `^${escapeRegex(input.personal.usn)}$`, $options: "i" },
    status: { $in: IN_FLIGHT },
  });
  if (duplicate) {
    return { ok: false, existingId: duplicate.id };
  }

  const application = { ...input, id: generateId() };
  try {
    await collections.insertOne({ ...application, _id: new ObjectId() });
    return { ok: true, id: application.id };
  } catch (error) {
    if (isDuplicateKeyId(error)) {
      // Rare collision on the unique `id` index — retry once with a fresh id.
      const retry = { ...application, id: generateId() };
      try {
        await collections.insertOne({ ...retry, _id: new ObjectId() });
        return { ok: true, id: retry.id };
      } catch (retryError) {
        if (isDuplicateKeyId(retryError)) {
          return { ok: false, existingId: retry.id };
        }
        throw retryError;
      }
    }
    throw error;
  }
}

export async function listApplications({ status, query } = {}) {
  await ensureIndexes();
  const collections = await applicationsCollection();

  const filter = {};
  const cleanStatus = status?.trim();
  if (cleanStatus && cleanStatus !== "All") {
    filter.status = cleanStatus;
  }
  const cleanQuery = query?.trim();
  if (cleanQuery) {
    const rx = new RegExp(escapeRegex(cleanQuery), "i");
    filter.$or = [
      { "personal.fullName": rx },
      { "personal.usn": rx },
      { "personal.department": rx },
      { "personal.email": rx },
      { "startups.name": rx },
    ];
  }

  const rows = await collections
    .find(filter)
    .sort({ submittedAt: -1 })
    .limit(500)
    .toArray();

  return rows.map((row) => summarise(stripMongo(row)));
}

export async function getApplication(id) {
  await ensureIndexes();
  const collections = await applicationsCollection();
  const doc = await collections.findOne({ id });
  return doc ? stripMongo(doc) : null;
}

export async function updateApplication(id, patch) {
  await ensureIndexes();
  const collections = await applicationsCollection();

  const current = await collections.findOne({ id });
  if (!current) return null;

  const set = {};
  if (patch.status) {
    if (patch.status !== current.status) {
      set.status = patch.status;
      set.reviewedAt = new Date().toISOString();
    }
  }
  if (patch.reviewNotes !== undefined) {
    set.reviewNotes = patch.reviewNotes;
  }
  if (patch.meeting !== undefined) {
    if (patch.meeting === null || !hasMeaningfulMeeting(patch.meeting)) {
      set.meeting = null;
    } else {
      set.meeting = {
        at: patch.meeting.at,
        link: patch.meeting.link ?? "",
        notes: patch.meeting.notes ?? "",
      };
    }
  }

  if (Object.keys(set).length === 0) return stripMongo(current);

  const updated = await collections.findOneAndUpdate(
    { id },
    { $set: set },
    { returnDocument: "after" }
  );
  if (!updated) return null;
  return stripMongo(updated);
}

export async function listApplicationsByEmail(email) {
  await ensureIndexes();
  const collections = await applicationsCollection();
  const pattern = `^${escapeRegex(String(email || "").trim())}$`;
  const rows = await collections
    .find({
      $or: [
        { "personal.email": { $regex: pattern, $options: "i" } },
        { memberEmail: { $regex: pattern, $options: "i" } },
      ],
    })
    .sort({ submittedAt: -1 })
    .limit(20)
    .toArray();
  return rows.map((row) => stripMongo(row));
}

export function statuses() {
  return APPLICATION_STATUSES;
}

export function isApplicationStatus(value) {
  return (
    typeof value === "string" && APPLICATION_STATUSES.includes(value)
  );
}
