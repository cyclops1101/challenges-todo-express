import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export interface AuthRequest extends Request {
  user?: string;
}

export const authenticationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Get auth token from header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  // Verify and decode token
  try {
    const decoded = jwt.verify(token, "secret", {
      ignoreExpiration: false,
    });

    const existingUser = await User.findOne({ _id: decoded.sub });
    if (!existingUser || typeof decoded.sub !== "string") {
      throw new Error("Invalid user ID");
    }

    // Add user info to request
    req.user = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
