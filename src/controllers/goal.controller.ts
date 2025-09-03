import { Request, Response } from "express";
import { logger } from "../config/logger.config.ts";
import Goal from "../models/goal.model.ts";

export const getGoals = async (req: Request, res: Response) => {
  try {
    let userId = req.session.userId;
    let goals = await Goal.find({ userId });

    if (goals.length > 0) {
      res.status(200).json({ goals });
      return;
    } else {
      res.status(404).json({ message: "No goals found" });
      return;
    }

  } catch (error: any) {
    logger.error(`Error fetching goals: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export const setGoal = async (req: Request, res: Response) => {
  try {
    let { title, targetAmount, deadline } = req.body;

    if (typeof title !== "string" || typeof targetAmount !== "number" || typeof deadline !== "string") {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    let userId = req.session.userId;
    let goal = new Goal({
      userId,
      title,
      targetAmount,
      deadline
    });

    await goal.save();

    res.status(201).json({ message: "Goal set successfully", goal });
    return;
  } catch (error: any) {
    logger.error(`Error setting goal: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function getOneGoal(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let goal = await Goal.findOne({ _id: id, userId });

    if (goal) {
      res.status(200).json({ message: "Goal fetched successfully", goal });
      return;
    } else {
      res.status(404).json({ message: "Goal not found" });
      return;
    }
  } catch (err: any) {
    logger.error(`Error fetching goal: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function updateOneGoal(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let { title, targetAmount, deadline, status } = req.body;

    if (typeof title !== "string" || typeof targetAmount !== "number" || typeof deadline !== "string" || typeof status !== "string") {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    let goal = await Goal.findOneAndUpdate({ _id: id, userId }, { title, targetAmount, deadline, status }, { new: true });

    if (goal) {
      res.status(200).json({ message: "Goal updated successfully", goal });
      return;
    } else {
      res.status(404).json({ message: "Goal not found" });
      return;
    }
  } catch (err: any) {
    logger.error(`Error updating goal: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export async function deleteOneGoal(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (goal) {
      res.status(200).json({ message: "Goal deleted successfully", goal });
      return;
    } else {
      res.status(404).json({ message: "Goal not found" });
      return;
    }
  } catch (err: any) {
    logger.error(`Error deleting goal: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}