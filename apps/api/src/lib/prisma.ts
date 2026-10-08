import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Ensure we load the .env from the apps/api directory no matter where this is run from
// BUT ONLY for local development. Vercel provides env vars via process.env directly.
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
