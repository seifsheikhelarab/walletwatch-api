import cron from 'node-cron';
import { emailTemplates, sendEmail } from './mail.config.js';
import User from '../models/user.model.js';
import { logger } from './logger.config.js';
import { Notification } from '../models/notification.model.js';
import Budget from '../models/budget.model.js';

function sendReportEmailMonthly() {
  // Every month on the 1st at 10 AM
  cron.schedule("0 10 1 * *", async () => {
    logger.info('Sending monthly budget report emails...');
    const users = await User.find();
    for (const user of users) {
      await sendEmail(user.email, emailTemplates.report().subject, emailTemplates.report().html);

      const report = new Notification({
        userId: user._id,
        type: "report",
        message: "Your monthly budget report has been sent to your email.",
        sentAt: new Date()
      });
      await report.save();
    }
    logger.info('Monthly budget report emails sent successfully.');
  });
}

function sendReminderEmailDaily() {

  // Every day at 8 PM
  cron.schedule("0 20 * * *", async () => {

    logger.info('Sending daily budget reminder emails...');

    const users = await User.find();

    for (const user of users) {

      await sendEmail(user.email, emailTemplates.reminder().subject, emailTemplates.reminder().html);

      const reminder = new Notification({
        userId: user._id,
        type: "reminder",
        message: "This is your daily budget reminder.",
        sentAt: new Date()
      });

      await reminder.save();
    }

    logger.info('Daily budget reminder emails sent successfully.');

  });
}

function sendOverspendingAlert() {

  cron.schedule("0 9 * * *", async () => {

    logger.info('Checking for overspending alerts...');
    const users = await User.find();

    for (const user of users) {
      const budgets = await Budget.find({ userId: user._id });
      for (const budget of budgets) {
        if (await budget.isOverspent()) {
          await sendEmail(user.email,
            emailTemplates.overspending(user.name, await budget.getUsagePercentage(), await budget.calculateSpent()).subject,
            emailTemplates.overspending(user.name, await budget.getUsagePercentage(), await budget.calculateSpent()).html
          );
        }
      }
    }
    logger.info('Overspending alerts checked successfully.');
  })
}

export default function schedulerSetup() {
  sendReportEmailMonthly();
  sendReminderEmailDaily();
  sendOverspendingAlert();
}