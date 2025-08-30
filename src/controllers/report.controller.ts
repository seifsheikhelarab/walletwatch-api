import { Request, Response } from "express";
import { logger } from "../config/logger.config.ts";
import { Notification } from "../models/notification.model.ts";

export const getReports = async (req: Request, res: Response) => {
  try {
    let userId = req.session.userId;

    let reports = await Notification.find({ userId, type: 'report' });

    if (reports) {
      res.status(200).json({ reports });
    } else {
      res.status(404).json({ message: "No reports found" });
    }

  } catch (error: any) {
    logger.error(`Error fetching reports: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getNotifications = async (req: Request, res: Response) => {
  try {
    let userId = req.session.userId;

    let notifications = await Notification.find({ userId });

    if (notifications) {
      res.status(200).json({ notifications });
    } else {
      res.status(404).json({ message: "No notifications found" });
    }

  } catch (error: any) {
    logger.error(`Error fetching notifications: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}