import { Request, Response } from "express";
import { logger } from "../config/logger.config.js";
import { Notification } from "../models/notification.model.js";

export async function getReports(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.session.userId;

    const reports = await Notification.find({ userId, type: 'report' });

    if (reports) {
      res.status(200).json({ reports });
    } else {
      res.status(404).json({ message: "No reports found" });
    }

  } catch (error: unknown) {
    logger.error(`Error fetching reports: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNotifications(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.session.userId;

    const notifications = await Notification.find({ userId });

    if (notifications) {
      res.status(200).json({ notifications });
    } else {
      res.status(404).json({ message: "No notifications found" });
    }

  } catch (error: unknown) {
    logger.error(`Error fetching notifications: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
}