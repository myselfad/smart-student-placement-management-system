import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 4000;

console.info('[startup] NODE_ENV              :', process.env.NODE_ENV ?? '(not set)');
console.info('[startup] DATABASE_URL present  :', !!process.env.DATABASE_URL);
console.info('[startup] JWT_SECRET present    :', !!process.env.JWT_SECRET);
console.info('[startup] FRONTEND_URL present  :', !!process.env.FRONTEND_URL);

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
