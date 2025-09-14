import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import Goal from "../models/goal.model.js";
import { validationResult } from "express-validator";

export async function getGoals(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.session.userId;
    const goals = await Goal.find({ userId });

    if (goals.length > 0) {
      res.status(200).json({ goals });
      return;
    } else {
      res.status(404).json({ message: "No goals found" });
      return;
    }

  } catch (error: unknown) {
    logger.error(`Error fetching goals: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function setGoal(
  req: Request<object, object, { title: string; targetAmount: number; deadline: Date }>,
  res: Response
): Promise<void> {
  try {
    const { title, targetAmount, deadline } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, message: "Input Validation Error", errors: errors.array() });
      return;
    }

    const userId = req.session.userId;
    const goal = new Goal({
      userId,
      title,
      targetAmount,
      deadline
    });

    await goal.save();

    res.status(201).json({ message: "Goal set successfully", goal });
    return;
  } catch (error: unknown) {
    logger.error(`Error setting goal: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function getOneGoal(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;

    const goal = await Goal.findOne({ _id: id, userId });

    if (goal) {
      res.status(200).json({ message: "Goal fetched successfully", goal });
      return;
    } else {
      res.status(404).json({ message: "Goal not found" });
      return;
    }
  } catch (err: unknown) {
    logger.error(`Error fetching goal: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function updateOneGoal(
  req: Request<{ id: string }, object, { title: string, targetAmount: number, deadline: Date, status: string }>,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;

    const { title, targetAmount, deadline, status } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ statusCode: 400, message: "Input Validation Error", errors: errors.array() });
      return;
    }

    const goal = await Goal.findOneAndUpdate({ _id: id, userId }, { title, targetAmount, deadline, status }, { new: true });

    if (goal) {
      res.status(200).json({ message: "Goal updated successfully", goal });
      return;
    } else {
      res.status(404).json({ message: "Goal not found" });
      return;
    }
  } catch (err: unknown) {
    logger.error(`Error updating goal: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function deleteOneGoal(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;

    const goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (goal) {
      res.status(200).json({ message: "Goal deleted successfully", goal });
      return;
    } else {
      res.status(404).json({ message: "Goal not found" });
      return;
    }
  } catch (err: unknown) {
    logger.error(`Error deleting goal: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}