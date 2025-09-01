import { Request, Response } from "express";
import { logger } from "../config/logger.config.ts";
import User, { IUser } from "../models/user.model.ts";
import { validationResult } from "express-validator";

declare module "express-session" {
  interface SessionData {
    userId: string;
    isAuthenticated?: boolean;
  }
}

export const registerController = async (req: Request, res: Response) => {
  try {

    let { name, email, password, income } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, errors: errors.array() });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ statusCode: 409, message: "Email already in use" });
    }

    let user = await User.create({ name, email, password, income });

    req.session.userId = user._id.toString();

    let returnUser = {
      name: user.name,
      email: user.email,
      income: user.income,
      oauth: user.oauth,
    };

    logger.info(`User registered: ${user.email}`);
    res.status(201).json({ statusCode: 201, message: "User registered successfully", user: returnUser });


  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal server error", error: error.message });
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {

    let { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ statusCode: 400, message: "Email and password are required" });
    }

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(404).json({ statusCode: 404, message: "User not found" });
    } else if (!(await user.checkPassword(password))) {
      res.status(401).json({ statusCode: 401, message: "Invalid credentials" });
    } else {
      req.session.userId = user._id.toString();

      logger.info(`User logged in: ${user.email}`);

      let returnUser = {
        name: user.name,
        email: user.email,
        income: user.income,
        oauth: user.oauth,
      };

      res.status(200).json({ statusCode: 200, message: "Login successful", user: returnUser });
    }
  } catch (error: any) {
    logger.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}

export const logoutController = (req: Request, res: Response) => {
  try {

    req.session.destroy(err => { if (err) logger.error(err) });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logout successful" });
    logger.info(`User logged out: ${req.session.userId}`);

  } catch (error: any) {
    logger.error(`Error logging out user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error('No user data from Google');
    }

    const user = req.user as IUser;
    req.session.userId = user._id.toString();
    req.session.isAuthenticated = true;

    res.json({ message: "Google authentication successful", user });
    logger.info(`User logged in via Google: ${user.email}`);
  } catch (error: any) {
    logger.error('Google OAuth error:', error);
    res.status(500).json({ message: "An error occurred during Google authentication" });
  }
}