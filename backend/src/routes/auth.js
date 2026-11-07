import { Router } from "express";
import { createMember, verifyMemberLogin } from "../lib/users.js";
import {
  MEMBER_SESSION_COOKIE,
  MEMBER_TTL_SECONDS,
  ADMIN_TTL_SECONDS,
  clearCookieOptions,
  cookieOptions,
  createMemberToken,
  createAdminToken,
  readMemberPayload,
  verifyAdminToken,
  isMemberSessionConfigured,
  isAdminConfigured,
  ADMIN_SESSION_COOKIE,
} from "../lib/sessions.js";
import { getApplication, listApplicationsByEmail } from "../lib/applications.js";
import { ensureIndexes } from "../lib/mongodb.js";
import { clientIp, rateLimit } from "../lib/rateLimit.js";
import { config } from "../config.js";

const router = Router();

function fail(res, status, error) {
  return res.status(status).json({ error });
}

function isAdminEmail(email) {
  return (
    Boolean(config.adminEmail) &&
    String(email || "").trim().toLowerCase() === config.adminEmail.toLowerCase()
  );
}

function adminSessionPayload() {
  return {
    email: config.adminEmail,
    name: config.adminName,
    role: "admin",
    title: "Administrator",
    loginTime: Date.now(),
  };
}

router.post("/auth/register", async (req, res) => {
  if (!isMemberSessionConfigured()) {
    return fail(res, 503, "Signup is not configured yet. Please try again later.");
  }
  if (!rateLimit(`auth-register:${clientIp(req)}`, 5, 60_000)) {
    return res
      .set("Retry-After", "60")
      .status(429)
      .json({ error: "Too many requests. Please try again in a minute." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (isAdminEmail(email)) {
    return fail(
      res,
      403,
      "This email is reserved for the administrator. Please sign in instead."
    );
  }

  try {
    const result = await createMember({ name, email, password });
    if (!result.ok) return fail(res, 400, result.error);

    res
      .cookie(
        MEMBER_SESSION_COOKIE,
        createMemberToken(result.member),
        cookieOptions(req, MEMBER_TTL_SECONDS)
      )
      .status(201)
      .json({ user: { ...result.member, role: "member" } });
  } catch (error) {
    console.error("[auth/register] database unavailable", error);
    fail(res, 503, "Signup is unavailable right now. Please try again shortly.");
  }
});

router.post("/auth/login", async (req, res) => {
  if (!isMemberSessionConfigured()) {
    return fail(res, 503, "Sign-in is not configured yet. Please try again later.");
  }
  if (!rateLimit(`auth-login:${clientIp(req)}`, 10, 60_000)) {
    return res
      .set("Retry-After", "60")
      .status(429)
      .json({ error: "Too many requests. Please try again in a minute." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  try {
    const result = await verifyMemberLogin({ email, password });
    if (!result.ok) return fail(res, 401, result.error);

    const adminAccount = isAdminEmail(result.member.email);
    const user = adminAccount
      ? { ...result.member, role: "admin", title: "Administrator" }
      : { ...result.member, role: "member" };

    res.cookie(
      MEMBER_SESSION_COOKIE,
      createMemberToken(result.member),
      cookieOptions(req, MEMBER_TTL_SECONDS)
    );

    if (adminAccount && isAdminConfigured()) {
      res.cookie(
        ADMIN_SESSION_COOKIE,
        createAdminToken(),
        cookieOptions(req, ADMIN_TTL_SECONDS)
      );
    }

    res.json({ user });
  } catch (error) {
    console.error("[auth/login] database unavailable", error);
    fail(res, 503, "Sign-in is unavailable right now. Please try again shortly.");
  }
});

router.post("/auth/logout", (req, res) => {
  res
    .cookie(MEMBER_SESSION_COOKIE, "", clearCookieOptions(req))
    .json({ ok: true });
});

router.get("/auth/session", (req, res) => {
  if (verifyAdminToken(req.cookies?.[ADMIN_SESSION_COOKIE])) {
    return res.json({ session: adminSessionPayload() });
  }

  const member = readMemberPayload(req.cookies?.[MEMBER_SESSION_COOKIE]);
  if (member) {
    const adminAccount = isAdminEmail(member.email);
    return res.json({
      session: {
        email: member.email,
        name: member.name,
        role: adminAccount ? "admin" : "member",
        title: adminAccount ? "Administrator" : member.title,
        loginTime: member.issuedAt,
      },
    });
  }

  res.json({ session: null });
});

router.get("/auth/my-applications", async (req, res) => {
  const payload = readMemberPayload(req.cookies?.[MEMBER_SESSION_COOKIE]);
  if (!payload) return fail(res, 401, "Unauthorized");

  try {
    await ensureIndexes();
    const applications = await listApplicationsByEmail(payload.email);
    res.json({
      applications: applications.map((application) => ({
        id: application.id,
        submittedAt: application.submittedAt,
        status: application.status,
        startupName: application.startups?.[0]?.name ?? "",
        meeting: application.meeting ?? null,
      })),
    });
  } catch (error) {
    console.error("[auth/my-applications] database unavailable", error);
    fail(res, 503, "Database unavailable");
  }
});

router.get("/auth/my-applications/:id", async (req, res) => {
  const payload = readMemberPayload(req.cookies?.[MEMBER_SESSION_COOKIE]);
  if (!payload) return fail(res, 401, "Unauthorized");

  try {
    const application = await getApplication(String(req.params.id || ""));
    if (!application) return fail(res, 404, "Application not found");

    const memberEmail = String(payload.email || "").toLowerCase();
    const ownsApplication =
      String(application.personal?.email || "").toLowerCase() === memberEmail ||
      String(application.memberEmail || "").toLowerCase() === memberEmail;
    if (!ownsApplication) return fail(res, 404, "Application not found");

    const safeApplication = {
      ...application,
      reviewNotes: "",
      reviewedAt: null,
    };
    delete safeApplication.memberEmail;

    res.json({ application: safeApplication });
  } catch (error) {
    console.error("[auth/my-applications/:id] database unavailable", error);
    fail(res, 503, "Database unavailable");
  }
});

// Defensive re-export used by index.js registration sanity checks.
export default router;