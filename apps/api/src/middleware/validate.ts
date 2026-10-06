import { Request, Response, NextFunction } from "express";

/**
 * Validates req.body against a Zod schema.
 * Uses safeParse (not instanceof ZodError) because the shared-types package
 * may ship a different Zod version than the API.
 */
export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
      const issues = result.error?.issues ?? result.error?.errors ?? [];
      const first = issues[0];
      const field = first?.path?.join(".");
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: first ? `${field ? field + ": " : ""}${first.message}` : "Validation failed",
          details: issues,
        },
      });
    }
    req.body = result.data;
    next();
  };
};
