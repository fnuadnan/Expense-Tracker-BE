import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Express user to include the payload type we expect from JWT
declare global {
  namespace Express {
    interface Request {
      user?: object | string;
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["x-auth-token"]; // Assuming the token is stored in an HttpOnly cookie
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY as string);
      req.user = decoded;
    } catch (error) {
      console.log("Invalid token, continuing as unauthenticated...");
    }
  }
  next();
}

export default verifyToken;
