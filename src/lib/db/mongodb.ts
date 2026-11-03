import {
  Document,
  MongoClient,
  type Collection,
  type Db,
  type WithId,
} from "mongodb";
import type { MembershipApplication } from "@/lib/membership/options";

/** Stored for every registered member (admin accounts never live in MongoDB). */
export type MemberDoc = WithId<{
  email: string;
  name: string;
  title: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}>;

/**
 * Shared MongoDB client for Vercel serverless functions. The client is cached
 * on globalThis so warm invocations reuse the connection pool instead of
 * opening a new one per request (the pattern recommended for serverless).
 */

const URI_ENV = "MONGODB_URI";

const globalStore = globalThis as typeof globalThis & {
  __blieveMongoClientPromise?: Promise<MongoClient>;
};

function readUri(): string {
  const uri = process.env[URI_ENV];
  if (!uri || uri.trim().length === 0) {
    throw new Error(
      "MONGODB_URI is not configured. Set it in your environment before calling the database."
    );
  }
  return uri.trim();
}

export function getMongoClient(): Promise<MongoClient> {
  if (!globalStore.__blieveMongoClientPromise) {
    globalStore.__blieveMongoClientPromise = new MongoClient(readUri(), {
      // Serverless: cap the pool so concurrent lambdas do not exhaust Atlas
      // and do not keep sockets alive longer than needed.
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10_000,
      retryWrites: true,
    }).connect();
  }
  return globalStore.__blieveMongoClientPromise;
}

// Guards re-used by routes so they can respond with 503 instead of crashing
// when the connection string has not been configured (e.g. preview builds).
export function isDatabaseConfigured(): boolean {
  return (process.env[URI_ENV] ?? "").trim().length > 0;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const name = process.env.MONGODB_DB_NAME || "blieve";
  return client.db(name);
}

export type Collections = {
  users: Collection<Omit<MemberDoc, "_id">>;
  applications: Collection<MembershipApplication>;
  submissions: Collection<Document>;
  messages: Collection<Document>;
  newsletterSubscribers: Collection<Document>;
};

export async function getCollections(): Promise<Collections> {
  const db = await getDb();
  return {
    users: db.collection("users"),
    applications: db.collection("applications"),
    submissions: db.collection("submissions"),
    messages: db.collection("messages"),
    newsletterSubscribers: db.collection("newsletter_subscribers"),
  };
}

let indexesReady: Promise<void> | null = null;

/** Idempotent; runs at most once per serverless instance. */
export function ensureIndexes(): Promise<void> {
  indexesReady ??= (async () => {
    const collections = await getCollections();
    await Promise.all([
      collections.users.createIndex({ email: 1 }, { unique: true, name: "users_email_unique" }),
      collections.applications.createIndex(
        { id: 1 },
        { unique: true, name: "applications_id_unique" }
      ),
      collections.applications.createIndex(
        { "personal.email": 1, "personal.usn": 1, status: 1 },
        { name: "applications_dedupe" }
      ),
      collections.submissions.createIndex(
        { email: 1, createdAt: -1 },
        { name: "submissions_email_recent" }
      ),
      collections.messages.createIndex(
        { createdAt: -1 },
        { name: "messages_recent" }
      ),
      collections.newsletterSubscribers.createIndex(
        { email: 1 },
        { unique: true, name: "newsletter_email_unique" }
      ),
    ]);
  })().catch((error) => {
    indexesReady = null;
    throw error;
  });
  return indexesReady;
}
