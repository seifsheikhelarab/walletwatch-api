import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import User from "../models/user.model.js";

export const getExpenses = async (req: Request, res: Response) => {

  try {
    const userId = req.session.userId;

    let user = await User.findById(userId);

  } catch (error: any) {
    logger.error(`Error fetching expenses: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const addExpense = async (req: Request, res: Response) => {

}

export const getExpenseById = async (req: Request, res: Response) => {

}

export const updateExpense = async (req: Request, res: Response) => {

}

export const deleteExpense = async (req: Request, res: Response) => {

}