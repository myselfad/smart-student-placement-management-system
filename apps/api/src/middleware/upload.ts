import multer from "multer";
import path from "path";
import fs from "fs";

// Use /tmp on Vercel (serverless read-only filesystem) or local uploads folder
const uploadDir = process.env.VERCEL ? path.join("/tmp", "uploads/resumes") : path.join(process.cwd(), "uploads/resumes");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err: any) {
  console.warn("[startup] Could not create upload directory:", err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // @ts-ignore - req.user is injected by auth middleware but multer types might not see it
    const userId = req.user?.id || "unknown";
    cb(null, userId + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf" && ext !== ".doc" && ext !== ".docx") {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
    cb(null, true);
  },
});
