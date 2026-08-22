import { Request, Response, NextFunction } from "express";
import fs from "fs";
import fileType from "file-type";

export const requireSecureFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    // 1. Magic Number Validation
    const buffer = fs.readFileSync(req.file.path);
    const type = await fileType.fromBuffer(buffer);
    
    if (!type || !['pdf', 'docx'].includes(type.ext)) {
      // Clean up invalid file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid file type detected by magic number" });
    }

    // 2. Mock Antivirus Scanning (P1 requirement simulation)
    const isClean = await mockAvScan(req.file.path);
    if (!isClean) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "File rejected by antivirus scan" });
    }

    next();
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

const mockAvScan = async (filePath: string): Promise<boolean> => {
  // Simulate an async AV scan operation
  return new Promise((resolve) => {
    setTimeout(() => {
      // 99% chance of being clean, for testing purposes
      resolve(Math.random() > 0.01);
    }, 500);
  });
};
