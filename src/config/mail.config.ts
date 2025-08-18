//Configuration for sending emails using Nodemailer

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const mailConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
    },
    from: process.env.SMTP_FROM!
};


export const emailTemplates = {
    welcome: (firstName: string) => ({
        subject: 'Welcome to WalletWatch!',
        html: `
            <h2>Welcome to WalletWatch!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining WalletWatch. We're excited to help you manage your Budgets and expenses more efficiently.</p>
            <p>Visit your dashboard: <a href="${process.env.APP_URL!}/">Click here</a></p>
        `
    })
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport(mailConfig);
        const info = await transporter.sendMail({
            from: `"WalletWatch" <${mailConfig.from}>`,
            to,
            subject,
            html
        });
        return info;
    } catch (error: any) {
        throw error;
    }
};