import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { Role } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

/** Everyone who works in the placement cell (can view students, drives, applications). */
export const STAFF_ROLES: Role[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR];
/** Staff who can make hiring decisions (change application status). */
export const MANAGER_ROLES: Role[] = [Role.SUPER_ADMIN, Role.ADMIN];

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing or invalid token" } });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token) as { id: string; role: Role };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Token expired or invalid" } });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You don't have permission to do this" } });
    }
    next();
  };
};
