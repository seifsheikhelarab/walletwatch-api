import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";

export const getBudgets = async (req: Request, res: Response) => {
  try {
    
  } catch (error: any) {
    logger.error(`Error fetching budgets: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const setBudget = async (req: Request, res: Response) => {

}

export const getGoals = async (req: Request, res: Response) => {

}

export const setGoal = async (req: Request, res: Response) => {

}