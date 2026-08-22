import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return secret;
};

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getJwtSecret());
};
