import cron from 'node-cron';
import { emailTemplates, sendEmail } from './mail.config.js';
import User from '../models/user.model.js';
import { logger } from './logger.config.js';
import { Notification } from '../models/notification.model.js';

function sendReportEmailMonthly() {
  // Every month on the 1st at 10 AM
  cron.schedule("0 10 1 * *", async () => {
    let users = await User.find();
    for (let user of users) {
      await sendEmail(user.email, emailTemplates.report().subject, emailTemplates.report().html);

      let report = new Notification({
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
    let users = await User.find();
    for (let user of users) {
      await sendEmail(user.email, emailTemplates.reminder().subject, emailTemplates.reminder().html);

      let reminder = new Notification({
        userId: user._id,
        type: "reminder",
        message: "This is your daily budget reminder.",
        sentAt: new Date()
      });
    }
    logger.info('Daily budget reminder emails sent successfully.');
  });
}

//To do
// function sendOverspendingAlert() {
//   // Every day at 8 PM
//   cron.schedule("0 20 * * *", async () => {
//     let users = await User.find();
//     for (let user of users) {
//       let 
//       if (user.spent > user.budget) {
//         await sendEmail(user.email, emailTemplates.overspending().subject, emailTemplates.overspending().html);
//       }
//     }
//     logger.info('Overspending alerts sent successfully.');
//   });
// }

export default function schedulerSetup() {
  sendReportEmailMonthly();
  sendReminderEmailDaily();
  // sendOverspendingAlert(); // Uncomment when implemented
}