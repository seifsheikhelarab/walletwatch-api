import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import Budget from "../models/budget.model.js";

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
    let { amount, startDate, endDate } = req.body;
    let userId = req.session.userId;
    let budget = new Budget({
      userId,
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

export async function getOneBudget(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let budget = await Budget.findOne({ _id: id, userId });

    if (budget) {
      res.status(200).json({ budget });
    } else {
      res.status(404).json({ message: "Budget not found" });
    }

  } catch (error: any) {
    logger.error(`Error fetching budget: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateOneBudget(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let { amount, startDate, endDate } = req.body;
    let userId = req.session.userId;

    let budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { amount, startDate, endDate },
      { new: true }
    );

    if (budget) {
      res.status(200).json({ message: "Budget updated successfully", budget });
    } else {
      res.status(404).json({ message: "Budget not found" });
    };
  } catch (error: any) {
    logger.error(`Error updating budget: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteOneBudget(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;
    let budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (budget) {
      res.status(200).json({ message: "Budget deleted successfully" });
    } else {
      res.status(404).json({ message: "Budget not found" });
    }
  } catch (error: any) {
    logger.error(`Error deleting budget: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}