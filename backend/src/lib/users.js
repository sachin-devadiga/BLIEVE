import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ensureIndexes, getDb } from "./mongodb.js";

/**
 * MongoDB-backed member accounts. Passwords are hashed with scrypt
 * (per-user random salt, constant-time comparison) — never stored or
 * transmitted in plaintext.
 */

const KEY_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password, salt) {
  return scryptSync(password, salt, KEY_LENGTH).toString("hex");
}

export function isEmailValid(email) {
  return EMAIL_RE.test(email);
}

export async function createMember({ name, email, password }) {
  const cleanName = String(name || "").trim();
  const key = String(email || "").trim().toLowerCase();

  if (cleanName.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }
  if (!isEmailValid(key)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  await ensureIndexes();
  const db = await getDb();

  const salt = randomBytes(16).toString("hex");
  const member = { email: key, name: cleanName, title: "Community Member" };

  try {
    await db.collection("users").insertOne({
      ...member,
      passwordHash: hashPassword(password, salt),
      salt,
      createdAt: new Date().toISOString(),
    });
    return { ok: true, member };
  } catch (error) {
    if (error && error.code === 11000) {
      return {
        ok: false,
        error: "An account with this email already exists. Try signing in.",
      };
    }
    throw error;
  }
}

export async function verifyMemberLogin({ email, password }) {
  const key = String(email || "").trim().toLowerCase();
  if (!key || !password) {
    return { ok: false, error: "Enter your email and password." };
  }

  await ensureIndexes();
  const db = await getDb();
  const doc = await db.collection("users").findOne({ email: key });

  if (!doc) {
    return { ok: false, error: "No account found with this email." };
  }
  const candidate = Buffer.from(hashPassword(password, doc.salt), "hex");
  const stored = Buffer.from(doc.passwordHash, "hex");
  if (
    candidate.length !== stored.length ||
    !timingSafeEqual(candidate, stored)
  ) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }

  return {
    ok: true,
    member: { email: doc.email, name: doc.name, title: doc.title },
  };
}
