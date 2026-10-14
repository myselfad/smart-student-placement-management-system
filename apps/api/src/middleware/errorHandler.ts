import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Structured server log — no secrets, no user data
  console.error(JSON.stringify({
    level: "error",
    method: req.method,
    path: req.path,
    message: err.message,
    // Only include stack in non-production
    ...(isProduction ? {} : { stack: err.stack }),
  }));

  // Sanitize Prisma errors so they don't expose schema details
  let message = "An unexpected error occurred. Please try again.";
  let code = "INTERNAL_SERVER_ERROR";

  if (!isProduction) {
    message = err.message;
  } else if (err.message?.includes("Unique constraint")) {
    code = "CONFLICT";
    message = "A record with these details already exists.";
  } else if (err.message?.includes("Record to update not found") ||
             err.message?.includes("Record to delete not found")) {
    code = "NOT_FOUND";
    message = "The requested record was not found.";
  }

  res.status(500).json({ error: { code, message } });
};
