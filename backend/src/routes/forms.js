import { Router } from "express";
import { randomBytes } from "node:crypto";
import { ensureIndexes, getDb } from "../lib/mongodb.js";
import {
  LIMITS,
  isHoneypotTriggered,
  isValidEmail,
  str,
  wantsJson,
} from "../lib/validate.js";
import { clientIp, rateLimit } from "../lib/rateLimit.js";
import { validateMembership } from "../lib/membershipValidate.js";
import { insertApplication } from "../lib/applications.js";

const router = Router();

const VALID_TYPES = ["student", "mentor", "sponsor"];

function jsonGuard(req, res) {
  if (!wantsJson(req)) {
    res.status(415).json({ error: "Content-Type must be application/json" });
    return true;
  }
  return false;
}

function readJson(req) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

function busy(res) {
  return res
    .set("Retry-After", "60")
    .status(429)
    .json({ error: "Too many requests. Please try again in a minute." });
}

function reference() {
  return `BLV-${new Date().getFullYear()}-${randomBytes(5)
    .toString("hex")
    .toUpperCase()
    .slice(0, 8)}`;
}

router.post("/apply", async (req, res) => {
  if (jsonGuard(req, res)) return;
  if (!rateLimit(`apply:${clientIp(req)}`, 5, 60_000)) return busy(res);

  const body = readJson(req);

  // Honeypot tripped: treat as accepted so bots cannot adapt, but drop it.
  if (isHoneypotTriggered(body)) {
    return res.json({ success: true, message: "Application received" });
  }

  const name = str(body.name, LIMITS.name);
  const email = str(body.email, LIMITS.email).toLowerCase();
  const phone = str(body.phone, LIMITS.phone);
  const year = str(body.year, LIMITS.type);
  const message = str(body.message, LIMITS.message);
  const type = str(body.type, LIMITS.type);
  const expertise = str(body.expertise, LIMITS.message);
  const organisation = str(body.organisation, LIMITS.name);

  if (!name || !email || !message || !type) {
    return res.status(400).json({
      error: "Name, email, message and application type are required.",
    });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid application type." });
  }

  try {
    await ensureIndexes();
    await (await getDb()).collection("submissions").insertOne({
      kind: "apply",
      type,
      name,
      email,
      phone,
      year,
      expertise,
      organisation,
      message,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[apply] failed to store submission", error);
    return res.status(503).json({
      error:
        "We could not receive your application right now. Please try again shortly.",
    });
  }

  console.log("[apply] stored", { type, email, name });
  res.json({ success: true, message: "Application received successfully" });
});

router.post("/contact", async (req, res) => {
  if (jsonGuard(req, res)) return;
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 60_000)) return busy(res);

  const body = readJson(req);

  if (isHoneypotTriggered(body)) {
    return res.json({ success: true, message: "Message sent" });
  }

  const name = str(body.name, LIMITS.name);
  const email = str(body.email, LIMITS.email).toLowerCase();
  const subject = str(body.subject, LIMITS.subject);
  const message = str(body.message, LIMITS.message);

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, subject and message are required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    await ensureIndexes();
    await (await getDb()).collection("messages").insertOne({
      kind: "contact",
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[contact] failed to store message", error);
    return res.status(503).json({
      error:
        "We could not send your message right now. Please try again shortly.",
    });
  }

  console.log("[contact] stored", { email });
  res.json({ success: true, message: "Message sent successfully" });
});

router.post("/newsletter", async (req, res) => {
  if (jsonGuard(req, res)) return;
  if (!rateLimit(`newsletter:${clientIp(req)}`, 3, 60_000)) return busy(res);

  const body = readJson(req);

  if (isHoneypotTriggered(body)) {
    return res.json({ success: true, message: "Subscribed" });
  }

  const email = str(body.email, 254).toLowerCase();
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ error: "A valid email address is required." });
  }

  try {
    await ensureIndexes();
    await (
      await getDb()
    )
      .collection("newsletter_subscribers")
      .updateOne(
        { email },
        { $setOnInsert: { email, createdAt: new Date().toISOString() } },
        { upsert: true }
      );
  } catch (error) {
    console.error("[newsletter] failed to store subscription", error);
    return res.status(503).json({
      error: "We could not subscribe you right now. Please try again shortly.",
    });
  }

  console.log("[newsletter] stored", { email });
  res.json({ success: true, message: "Subscribed successfully" });
});

router.post("/membership", async (req, res) => {
  if (jsonGuard(req, res)) return;
  if (!rateLimit(`membership:${clientIp(req)}`, 5, 60_000)) return busy(res);

  const body = readJson(req);

  if (isHoneypotTriggered(body)) {
    return res.json({
      success: true,
      applicationId: reference(),
    });
  }

  const result = validateMembership(body);
  if (!result.ok) {
    const ineligible = Object.keys(result.fieldErrors).length === 0;
    return res
      .status(ineligible ? 422 : 400)
      .json({ error: result.formError, fieldErrors: result.fieldErrors });
  }

  try {
    const stored = await insertApplication({
      ...result.data,
      submittedAt: new Date().toISOString(),
    });

    if (!stored.ok) {
      return res.status(409).json({
        error: `An application from this email and USN is already under review. Your reference ID is ${stored.existingId}.`,
        applicationId: stored.existingId,
      });
    }

    res.status(201).json({
      success: true,
      applicationId: stored.id,
      status: "Pending Review",
    });
  } catch (error) {
    console.error("[membership] failed to store application", error);
    res.status(503).json({
      error:
        "We could not receive your application right now. Please try again shortly.",
    });
  }
});

export default router;
