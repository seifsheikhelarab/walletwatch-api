import { Request, Response, NextFunction } from "express";


export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return next();
  else return res.status(401).json({ message: "you are already logged in" });
}