import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";

export const getExpenses = async (req: Request, res: Response) => {

  try {
    const userId = req.session.userId;

    let user = await User.findById(userId);

    let expenses = Expense.find({ userId: user!._id });

    res.status(200).json({ expenses });

  } catch (error: any) {
    logger.error(`Error fetching expenses: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const addExpense = async (req: Request, res: Response) => {
  try {
    let { amount, category, description } = req.body;

    let expense = new Expense({
      userId: req.session.userId,
      amount,
      category,
      description
    });

    await expense.save();

    res.status(201).json({ message: "Expense added successfully" });

  } catch (error: any) {
    logger.error(`Error adding expense ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getExpenseById = async (req: Request, res: Response) => {

  try {
    let userId = req.session.userId;
    let { id } = req.body;

    let expense = await Expense.find({
      _id: id,
      userId
    });

    if (expense) {
      res.status(200).send(expense);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error: any) {
    logger.error(`Error getting expense ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" })
  }


}

export const updateExpense = async (req: Request, res: Response) => {

  try {
    let { id, amount, category, description } = req.body;
    let userId = req.session.userId;

    let expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { amount, category, description, UpdatedAt: new Date() });

    if (expense) {
      res.status(200).json({ message: "Expense updated successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error: any) {
    logger.error(`Error updating expense: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteExpense = async (req: Request, res: Response) => {

  try {
    let userId = req.session.userId;
    let { ExpenseId } = req.body;

    let expense = await Expense.findOneAndDelete({ _id: ExpenseId, userId: userId });

    if (expense) {
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error: any) {
    logger.error(`Error deleting expense: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}