import { Request, Response } from "express";
import { logger } from "../config/logger.config.ts";
import User from "../models/user.model.ts";
import Expense from "../models/expense.model.ts";

export const getExpenses = async (req: Request, res: Response) => {

  try {
    const userId = req.session.userId;

    let user = await User.findById(userId);

    let expenses = await Expense.find({ userId: user!._id });

    if (expenses.length === 0) {
      res.status(404).json({ message: "No expenses found" });
      return;
    }

    res.status(200).json({ expenses });
    return;

  } catch (error: any) {
    logger.error(`Error fetching expenses: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export const addExpense = async (req: Request, res: Response) => {
  try {
    let { amount, category, description } = req.body;

    if (typeof amount !== "number" || typeof category !== "string" || typeof description !== "string" || amount < 0) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    let expense = new Expense({
      userId: req.session.userId,
      amount,
      category,
      description
    });

    await expense.save();

    res.status(201).json({ message: "Expense added successfully", expense });
    return;

  } catch (error: any) {
    logger.error(`Error adding expense ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export const getOneExpense = async (req: Request, res: Response) => {

  try {
    let userId = req.session.userId;
    let id = req.params.id;

    let expense = await Expense.findOne({
      _id: id,
      userId
    });

    if (expense) {
      res.status(200).json({expense});
      return;
    } else {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
  } catch (error: any) {
    logger.error(`Error getting expense ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export const updateOneExpense = async (req: Request, res: Response) => {

  try {
    let id = req.params.id;
    let { amount, category, description } = req.body;

    if (typeof amount !== "number" || typeof category !== "string" || typeof description !== "string" || amount < 0) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    let userId = req.session.userId;

    let expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { amount, category, description, UpdatedAt: new Date() });

    if (expense) {
      res.status(200).json({ message: "Expense updated successfully", expense });
      return;
    } else {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
  } catch (error: any) {
    logger.error(`Error updating expense: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export const deleteOneExpense = async (req: Request, res: Response) => {

  try {
    let userId = req.session.userId;
    let id = req.params.id;

    let expense = await Expense.findOneAndDelete({ _id: id, userId: userId });

    if (expense) {
      res.status(200).json({ message: "Expense deleted successfully", expense });
      return;
    } else {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
  } catch (error: any) {
    logger.error(`Error deleting expense: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}