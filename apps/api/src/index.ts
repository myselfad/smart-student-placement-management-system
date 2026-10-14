import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 4000;
const HOST = "0.0.0.0";

console.info("[startup] Node Version          :", process.version);
console.info("[startup] NODE_ENV              :", process.env.NODE_ENV ?? "(not set)");
console.info("[startup] PORT                  :", PORT);
console.info("[startup] DATABASE_URL present  :", !!process.env.DATABASE_URL);
console.info("[startup] JWT_SECRET present    :", !!process.env.JWT_SECRET);
console.info("[startup] FRONTEND_URL          :", process.env.FRONTEND_URL ?? "(not set)");
console.info(
  "[startup] STORAGE_PROVIDER      :",
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local"
);

app.listen(PORT, HOST, () => {
  console.log(`🚀 SSPMS API Server running on http://${HOST}:${PORT}`);
});
