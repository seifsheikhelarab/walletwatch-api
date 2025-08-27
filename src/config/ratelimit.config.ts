import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

export const authRateLimit = rateLimit({
  windowMs: 60000,
  limit: 5,
  handler: (req: Request, res: Response) => {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  },
  standardHeaders: true,
  legacyHeaders: false
});