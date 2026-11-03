import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ensureIndexes, getCollections, type MemberDoc } from "./mongodb";

/**
 * MongoDB-backed member accounts. Passwords are hashed with scrypt
 * (per-user random salt, constant-time comparison) — never stored or
 * transmitted in plaintext.
 */

export type { MemberDoc };

export type MemberPublic = {
  email: string;
  name: string;
  title: string;
};

export const MIN_PASSWORD_LENGTH = 8;
const KEY_LENGTH = 64;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, KEY_LENGTH).toString("hex");
}

export function isEmailValid(email: string): boolean {
  return EMAIL_RE.test(email);
}

export async function createMember(input: {
  name: string;
  email: string;
  password: string;
}): Promise<
  | { ok: true; member: MemberPublic }
  | { ok: false; error: string }
> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (!isEmailValid(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  await ensureIndexes();
  const collections = await getCollections();

  const salt = randomBytes(16).toString("hex");
  const member: MemberPublic = {
    email,
    name,
    title: "Community Member",
  };

  try {
    await collections.users.insertOne({
      ...member,
      role: "member" as const,
      passwordHash: hashPassword(input.password, salt),
      salt,
      createdAt: new Date().toISOString(),
    } as never);
    return { ok: true, member };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      (error as { code?: number }).code === 11000
    ) {
      return {
        ok: false,
        error: "An account with this email already exists. Try signing in.",
      };
    }
    throw error;
  }
}

export async function verifyMemberLogin(
  email: string,
  password: string
): Promise<{ ok: true; member: MemberPublic } | { ok: false; error: string }> {
  const key = String(email || "").trim().toLowerCase();
  if (!key || !password) {
    return { ok: false, error: "Enter your email and password." };
  }

  await ensureIndexes();
  const collections = await getCollections();
  const doc = (await collections.users.findOne({ email: key })) as
    | MemberDoc
    | null;

  if (!doc) {
    return { ok: false, error: "No account found with this email." };
  }
  const candidate = Buffer.from(hashPassword(password, doc.salt), "hex");
  const stored = Buffer.from(doc.passwordHash, "hex");
  if (candidate.length !== stored.length || !timingSafeEqual(candidate, stored)) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }

  return {
    ok: true,
    member: {
      email: doc.email,
      name: doc.name,
      title: doc.title,
    },
  };
}
