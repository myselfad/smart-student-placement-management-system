import app from '../apps/api/src/app';

// Startup: validate required env vars early so Vercel logs show a clear error
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error('[CONFIG ERROR] Missing required environment variables:', missing.join(', '));
  // Don't exit — still export app so Vercel can respond with 503 rather than a timeout
}

console.info('[startup] NODE_ENV             :', process.env.NODE_ENV ?? '(not set)');
console.info('[startup] DATABASE_URL present :', !!process.env.DATABASE_URL);
console.info('[startup] JWT_SECRET present   :', !!process.env.JWT_SECRET);
console.info('[startup] FRONTEND_URL present :', !!process.env.FRONTEND_URL);

export default app;
