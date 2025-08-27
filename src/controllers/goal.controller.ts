import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import Goal from "../models/goal.model.js";

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
      deadline
    });

    await goal.save();

    res.status(201).json({ message: "Goal set successfully" });
  } catch (error: any) {
    logger.error(`Error setting goal: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOneGoal(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let goal = await Goal.findOne({ _id: id, userId });

    if (goal) {
      res.status(200).json({ goal });
    } else {
      res.status(404).json({ message: "Goal not found" });
    }
  } catch (err: any) {
    logger.error(`Error fetching goal: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateOneGoal(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let { title, targetAmount, deadline, status } = req.body;

    let goal = await Goal.findOneAndUpdate({ _id: id, userId }, { title, targetAmount, deadline, status }, { new: true });

    if (goal) {
      res.status(200).json({ message: "Goal updated successfully", goal });
    } else {
      res.status(404).json({ message: "Goal not found" });
    }
  } catch (err: any) {
    logger.error(`Error updating goal: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteOneGoal(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let userId = req.session.userId;

    let goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (goal) {
      res.status(200).json({ message: "Goal deleted successfully" });
    } else {
      res.status(404).json({ message: "Goal not found" });
    }
  } catch (err: any) {
    logger.error(`Error deleting goal: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}