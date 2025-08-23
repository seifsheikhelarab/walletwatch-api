import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import User, { IUser } from "../models/user.model.js";
import { validationResult } from "express-validator";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
  }
}


export const registerController = async (req: Request, res: Response) => {
  try {
    let { name, email, password, income } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    let user = await User.create({ name, email, password, income });
    req.session.userId = user._id.toString();
    res.status(201).json({ message: "User registered successfully", user });
    logger.info(`User registered: ${user.email}`);
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    res.status(200).json({ message: "Login successful", user });

    logger.info(`User logged in: ${user.email}`);


  } catch (error: any) {
    logger.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const logoutController = (req: Request, res: Response) => {
  try { 
    req.session.destroy(err => logger.error(err));
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logout successful" });
  }catch(error: any){
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

    // res.redirect('/index');
  } catch (error: any) {
    logger.error('Google OAuth error:', error);
    res.status(500).json({ message: "An error occurred during Google authentication" });
  }
}