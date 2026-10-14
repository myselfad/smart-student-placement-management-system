import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// In local development, load .env from apps/api. On Render/Vercel, use platform env.
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("[CRITICAL CONFIG] DATABASE_URL is not set in environment variables.");
}

// Supabase and hosted PostgreSQL require SSL
const isProduction = process.env.NODE_ENV === "production";
const requiresSsl = databaseUrl?.includes("sslmode=require") || isProduction;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  max: parseInt(process.env.DB_POOL_SIZE || "10", 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("[PostgreSQL Pool Error]", err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
