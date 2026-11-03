import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import formRoutes from "./routes/forms.js";
import { config } from "./config.js";

// Render (or any reverse proxy) terminates TLS — honour X-Forwarded-Proto so
// session cookies get the `Secure` flag only when the request is HTTPS.
const app = express();
app.set("trust proxy", 1);

const allowedOrigins = new Set([
  ...config.corsOrigins,
  // Same-site subdomains of blieve.in are always welcome.
  "https://blieve.in",
  "https://www.blieve.in",
  // Local development of the web app.
  "http://localhost:3000",
]);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // curl / server-to-server
    const normalised = origin.replace(/\/$/, "");
    if (allowedOrigins.has(normalised) || normalised === "https://blieve.in") {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 86_400,
};

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ ok: true, env: config.env, time: new Date().toISOString() });
});

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", formRoutes); // /api/apply, /api/contact, /api/newsletter, /api/membership

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler: malformed JSON, unexpected throws.
app.use((error, _req, res, _next) => {
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON body" });
  }
  console.error("[server] uncaught error", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(
    `BLIEVE API listening on port ${config.port} (${config.env}) — CORS: ${
      config.corsOrigins.length > 0 ? config.corsOrigins.join(", ") : "blieve.in + localhost"
    }`
  );
});
