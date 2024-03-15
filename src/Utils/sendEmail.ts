import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'
import path from 'path';
import ejs from 'ejs';
import AppError from './errorHandler';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}

class EmailSender {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private async sendEmail(toAddress: string, subject: any, text: any, html: any): Promise<void> {
    try {
      const mailOptions: MailOptions = {
        from: process.env.EMAIL_USERNAME as string,
        to: toAddress,
        subject: subject,
        text: text,
        html: html,
      };
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent to:', mailOptions.to);
    } catch (error: any) {
      console.log(error)
      throw new AppError(error, 500);
    }
  }

  async sendWelcomeEmail(user: any) {
    const emailAddress: string = user.email;
    const username: string = user.username;
    const message: string = "Welcome to Scissors , your number one platform for short url. We are delighted to have you";
    const heading = 'Welcome';
    const templatePath = path.join(__dirname, '../views/email.ejs');
    const template = await ejs.renderFile(templatePath, {
      message,
      username,
      heading,
    });
    return this.sendEmail(emailAddress, message, heading, template);
  }
  
  async sendPasswordResetEmail(user: any, resetToken: string, url: string): Promise<void> {
    const timeRemainingInMinutes = Math.max(
      0,
      Math.ceil((user.passwordResetTokenExpiryTime - Date.now()) / 60000)
      );
    const username: string = user.firstName;
    const emailAddress: string = user.email;
    const subject: string = 'Password Reset';
    const text: string = `You have requested for a password reset Token. This token will be expiring in the next ${timeRemainingInMinutes} minutes.\nClick the link provided to reset your password`;
    const templatePath: string = path.join(__dirname, '../views/passwordToken.ejs');
    const htmlTemplate: string = await ejs.renderFile(templatePath, {
      message: text,
      username,
      heading: subject,
      url,
      token: resetToken,
    });


    return this.sendEmail(emailAddress, subject, text, htmlTemplate);
  }
}

export default EmailSender;
