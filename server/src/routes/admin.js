import { Router } from "express";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_TTL_SECONDS,
  adminPasswordMatches,
  clearCookieOptions,
  cookieOptions,
  createAdminToken,
  isAdmin,
  isAdminConfigured,
} from "../lib/sessions.js";
import {
  getApplication,
  isApplicationStatus,
  listApplications,
  updateApplication,
} from "../lib/applications.js";
import { str, wantsJson } from "../lib/validate.js";
import { clientIp, rateLimit } from "../lib/rateLimit.js";

const router = Router();

const unauthorised = (res) =>
  res.status(401).json({ error: "Unauthorized" });

function requireAdmin(req, res) {
  if (isAdmin(req)) return false;
  unauthorised(res);
  return true;
}

router.post("/admin/login", (req, res) => {
  if (!wantsJson(req)) {
    return res
      .status(415)
      .json({ error: "Content-Type must be application/json" });
  }

  if (!rateLimit(`admin-login:${clientIp(req)}`, 5, 60_000)) {
    return res
      .set("Retry-After", "60")
      .status(429)
      .json({ error: "Too many attempts. Please try again in a minute." });
  }

  if (!isAdminConfigured()) {
    return res.status(503).json({
      error:
        "Admin login is not configured. Set the ADMIN_PASSWORD environment variable on the server.",
    });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const password = str(body.password, 200);
  if (!password || !adminPasswordMatches(password)) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  res
    .cookie(
      ADMIN_SESSION_COOKIE,
      createAdminToken(),
      cookieOptions(req, ADMIN_TTL_SECONDS)
    )
    .json({ success: true });
});

router.post("/admin/logout", (req, res) => {
  res
    .cookie(ADMIN_SESSION_COOKIE, "", clearCookieOptions(req))
    .json({ success: true });
});

router.get("/admin/applications", async (req, res) => {
  if (requireAdmin(req, res)) return;

  const status = String(req.query.status ?? "");
  const query = String(req.query.q ?? "");

  if (status && status !== "All" && !isApplicationStatus(status)) {
    return res.status(400).json({ error: "Invalid status filter." });
  }

  try {
    const applications = await listApplications({ status, query });
    res.json({ applications, count: applications.length });
  } catch (error) {
    console.error("[admin/applications] database unavailable", error);
    res
      .status(503)
      .json({ error: "Database unavailable. Please try again shortly." });
  }
});

router.get("/admin/applications/:id", async (req, res) => {
  if (requireAdmin(req, res)) return;

  try {
    const application = await getApplication(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }
    res.json({ application });
  } catch (error) {
    console.error("[admin/applications/:id] database unavailable", error);
    res
      .status(503)
      .json({ error: "Database unavailable. Please try again shortly." });
  }
});

router.patch("/admin/applications/:id", async (req, res) => {
  if (requireAdmin(req, res)) return;

  if (!wantsJson(req)) {
    return res
      .status(415)
      .json({ error: "Content-Type must be application/json" });
  }

  if (!rateLimit(`admin-update:${clientIp(req)}`, 30, 60_000)) {
    return res
      .set("Retry-After", "60")
      .status(429)
      .json({ error: "Too many requests. Please try again in a minute." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  const patch = {};
  if (body.status !== undefined) {
    if (!isApplicationStatus(body.status)) {
      return res.status(400).json({ error: "Invalid status." });
    }
    patch.status = body.status;
  }
  if (body.reviewNotes !== undefined) {
    patch.reviewNotes = str(body.reviewNotes, 2000);
  }
  if (patch.status === undefined && patch.reviewNotes === undefined) {
    return res.status(400).json({ error: "Nothing to update." });
  }

  try {
    const application = await updateApplication(req.params.id, patch);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }
    res.json({ application });
  } catch (error) {
    console.error("[admin/applications/:id] update failed", error);
    res
      .status(503)
      .json({ error: "Database unavailable. Please try again shortly." });
  }
});

export default router;
