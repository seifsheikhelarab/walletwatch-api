import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import Budget from "../models/budget.model.js";
import { validationResult } from "express-validator";

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const budgets = await Budget.find({ userId });

    if (budgets.length > 0) {
      res.status(200).json({ statusCode: 200, message: "Budgets fetched successfully", budgets });
      logger.info(`Fetched budgets for user: ${userId}`);
      return;
    } else {
      res.status(404).json({ statusCode: 404, message: "No budgets found" });
      return;
    }

  } catch (error: unknown) {
    logger.error(`Error fetching budgets: ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}

export const setBudget = async (req: Request, res: Response) => {

  try {
    const { amount, startDate, endDate } = req.body;
    const userId = req.session.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, message: "Input Validation Error", errors: errors.array() });
      return;
    }

    const budget = new Budget({
      userId,
      amount,
      startDate,
      endDate
    });

    await budget.save();

    res.status(201).json({ statusCode: 201, message: "Budget set successfully", budget });
    logger.info(`Budget set for user: ${userId}`);
    return;

  } catch (error: unknown) {
    logger.error(`Error setting budget: ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    return;
  }
}

export async function getOneBudget(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.session.userId;

    const budget = await Budget.findOne({ _id: id, userId });

    if (budget) {
      res.status(200).json({ budget });
      logger.info(`Fetched budget for user: ${userId}`);
    } else {
      res.status(404).json({ statusCode: 404, message: "Budget not found" });
    }

  } catch (error: unknown) {
    logger.error(`Error fetching budget: ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
}

export async function updateOneBudget(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { amount, startDate, endDate } = req.body;
    const userId = req.session.userId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, message: "Input Validation Error", errors: errors.array() });
      return;
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { amount, startDate, endDate },
      { new: true }
    );

    if (budget) {
      res.status(200).json({ statusCode: 200, message: "Budget updated successfully", budget });
    } else {
      res.status(404).json({ statusCode: 404, message: "Budget not found" });
    };
  } catch (error: unknown) {
    logger.error(`Error updating budget: ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
}

export async function deleteOneBudget(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.session.userId;
    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (budget) {
      res.status(200).json({ statusCode: 200, message: "Budget deleted successfully" });
    } else {
      res.status(404).json({ statusCode: 404, message: "Budget not found" });
    }
  } catch (error: unknown) {
    logger.error(`Error deleting budget: ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
}