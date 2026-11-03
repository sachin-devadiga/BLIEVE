import { MongoClient } from "mongodb";
import { config, isMongoConfigured } from "../config.js";

/**
 * Shared MongoDB client. Cached on globalThis so warm processes reuse the
 * connection pool instead of opening a new client per queue tick (Render
 * keeps the process alive, but this also protects any serverless variant).
 */

const globalStore = globalThis;

function clientPromise() {
  if (!globalStore.__blieveMongoClientPromise) {
    globalStore.__blieveMongoClientPromise = new MongoClient(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      retryWrites: true,
    }).connect();
  }
  return globalStore.__blieveMongoClientPromise;
}

export function isDatabaseConfigured() {
  return isMongoConfigured();
}

export async function getDb() {
  const client = await clientPromise();
  return client.db(config.dbName);
}

let indexesReady = null;

export function ensureIndexes() {
  indexesReady ??= (async () => {
    const db = await getDb();
    await Promise.all([
      db
        .collection("users")
        .createIndex({ email: 1 }, { unique: true, name: "users_email_unique" }),
      db
        .collection("applications")
        .createIndex({ id: 1 }, { unique: true, name: "applications_id_unique" }),
      db.collection("applications").createIndex(
        { "personal.email": 1, "personal.usn": 1, status: 1 },
        { name: "applications_dedupe" }
      ),
      db
        .collection("submissions")
        .createIndex(
          { email: 1, createdAt: -1 },
          { name: "submissions_email_recent" }
        ),
      db
        .collection("messages")
        .createIndex({ createdAt: -1 }, { name: "messages_recent" }),
      db
        .collection("newsletter_subscribers")
        .createIndex(
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
