import express, { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const isProduction = process.env.NODE_ENV === "production";

  // Return safe error to client
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProduction ? "An unexpected error occurred. Please try again." : err.message,
    },
  });
};
