import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import Budget from "../models/budget.model.js";
import Goal from "../models/goal.model.js";

export const getBudgets = async (req: Request, res: Response) => {
  try {
    let userId = req.session.userId;
    let budgets = await Budget.find({ userId });

    if (budgets) {
      res.status(200).json({ budgets });
    } else {
      res.status(404).json({ message: "No budgets found" });
    }

  } catch (error: any) {
    logger.error(`Error fetching budgets: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const setBudget = async (req: Request, res: Response) => {

  try {
    let { type, amount, startDate, endDate } = req.body;
    let userId = req.session.userId;
    let budget = new Budget({
      userId,
      type,
      amount,
      startDate,
      endDate
    });

    await budget.save();

    res.status(201).json({ message: "Budget set successfully" });

  } catch (error: any) {
    logger.error(`Error setting budget: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getGoals = async (req: Request, res: Response) => {
  try {
    let userId = req.session.userId;
    let goals = await Goal.find({ userId });

    if (goals) {
      res.status(200).json({ goals });
    } else {
      res.status(404).json({ message: "No goals found" });
    }

  } catch (error: any) {
    logger.error(`Error fetching goals: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const setGoal = async (req: Request, res: Response) => {
  try {
    let { title, targetAmount, currentAmount, deadline } = req.body;
    let userId = req.session.userId;
    let goal = new Goal({
      userId,
      title,
      targetAmount,
      currentAmount,
      deadline
    });

    await goal.save();

    res.status(201).json({ message: "Goal set successfully" });
  } catch (error: any) {
    logger.error(`Error setting goal: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}