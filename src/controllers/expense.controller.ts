import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import { validationResult } from "express-validator";

export const getExpenses = async (req: Request, res: Response) => {

  try {
    const userId = req.session.userId;

    const user = await User.findById(userId);

    const expenses = await Expense.find({ userId: user!._id });

    if (expenses.length === 0) {
      res.status(404).json({ statusCode: 404, message: "No expenses found" });
      return;
    }

    res.status(200).json({ statusCode: 200, message: "Expenses fetched successfully", expenses });
    return;

  } catch (error: unknown) {
    logger.error(`Error fetching expenses: ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
    return;
  }
}

export const addExpense = async (req: Request, res: Response) => {
  try {
    const { amount, category, description } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, message: "Input Validation Error", errors: errors.array() });
      return;
    }

    const expense = new Expense({
      userId: req.session.userId,
      amount,
      category,
      description
    });

    await expense.save();

    res.status(201).json({ statusCode: 201, message: "Expense added successfully", expense });
    return;

  } catch (error: unknown) {
    logger.error(`Error adding expense ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    return;
  }
}

export const getOneExpense = async (req: Request, res: Response) => {

  try {
    const userId = req.session.userId;
    const id = req.params.id;

    const expense = await Expense.findOne({
      _id: id,
      userId
    });

    if (expense) {
      res.status(200).json({ statusCode: 200, message: "Expense fetched successfully", expense });
      return;
    } else {
      res.status(404).json({ statusCode: 404, message: "Expense not found" });
      return;
    }
  } catch (error: unknown) {
    logger.error(`Error getting expense ${error}`);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    return;
  }
}

export const updateOneExpense = async (req: Request, res: Response) => {

  try {
    const id = req.params.id;
    const { amount, category, description } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, message: "Input Validation Error", errors: errors.array() });
      return;
    }

    const userId = req.session.userId;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { amount, category, description, UpdatedAt: new Date() });

    if (expense) {
      res.status(200).json({ message: "Expense updated successfully", expense });
      return;
    } else {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
  } catch (error: unknown) {
    logger.error(`Error updating expense: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export const deleteOneExpense = async (req: Request, res: Response) => {

  try {
    const userId = req.session.userId;
    const id = req.params.id;

    const expense = await Expense.findOneAndDelete({ _id: id, userId: userId });

    if (expense) {
      res.status(200).json({ message: "Expense deleted successfully", expense });
      return;
    } else {
      res.status(404).json({ message: "Expense not found" });
      return;
    }
  } catch (error: unknown) {
    logger.error(`Error deleting expense: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}