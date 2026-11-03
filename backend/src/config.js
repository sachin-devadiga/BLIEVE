import "dotenv/config";

function splitOrigins(value) {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT || 4000),
  env: process.env.NODE_ENV || "development",
  mongoUri: (process.env.MONGODB_URI || "").trim(),
  dbName: process.env.MONGODB_DB_NAME || "blieve",
  sessionSecret: process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  adminName: process.env.ADMIN_NAME || "Administrator",
  adminEmail: process.env.ADMIN_EMAIL || "president@blieve.in",
  corsOrigins: splitOrigins(process.env.CORS_ORIGINS),
};

export function isMongoConfigured() {
  return config.mongoUri.length > 0;
}
