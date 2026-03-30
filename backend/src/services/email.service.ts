
import nodemailer from 'nodemailer';
import { ENV } from '../config/env.ts';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENV.EMAIL.HOST,
    port: ENV.EMAIL.PORT,
    secure: ENV.EMAIL.PORT === 465, // true for 465, false for other ports
    auth: {
      user: ENV.EMAIL.USER,
      pass: ENV.EMAIL.PASS,
    },
  });

  static async sendLeadNotification(lead: { fullName: string; email: string; phone: string; course: string; message: string }) {
    if (!ENV.EMAIL.USER || !ENV.EMAIL.PASS) {
      console.warn('⚠️ Email credentials not configured. Skipping notification.');
      return;
    }

    const mailOptions = {
      from: ENV.EMAIL.FROM,
      to: ENV.EMAIL.USER, // Send to site admin
      subject: `New Enrollment Lead: ${lead.fullName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #059669;">New Enrollment Application</h2>
          <p><strong>Full Name:</strong> ${lead.fullName}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Phone:</strong> ${lead.phone}</p>
          <p><strong>Course:</strong> ${lead.course}</p>
          <p><strong>Message:</strong> ${lead.message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated notification from EduInsta CMS.</p>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  static async sendPasswordReset(email: string, token: string) {
    if (!ENV.EMAIL.USER || !ENV.EMAIL.PASS) {
      console.warn('⚠️ Email credentials not configured. Reset token: ' + token);
      return;
    }

    const resetUrl = `${ENV.APP_URL}/#/reset-password?token=${token}`;

    const mailOptions = {
      from: ENV.EMAIL.FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #059669;">Password Reset</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p style="font-size: 12px; color: #666;">This link will expire in 1 hour.</p>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
