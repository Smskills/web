// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static getTransporter() {
    return nodemailer.createTransport({
      host: ENV.SMTP.HOST,
      port: ENV.SMTP.PORT,
      secure: ENV.SMTP.SECURE,
      auth: {
        user: ENV.SMTP.USER,
        pass: ENV.SMTP.PASS.replace(/\s+/g, ''),
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  static async sendPasswordResetLink(email: string, token: string, username: string) {
    const resetUrl = `http://localhost:3000/#/reset-password?token=${token}`;
    const transporter = this.getTransporter();

    try {
      await transporter.sendMail({
        from: `"Institutional Security" <${ENV.SMTP.USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 500px;">
            <h2 style="color: #059669;">Hello ${username},</h2>
            <p>You requested a password reset for the S M Skills admin dashboard.</p>
            <p>Click the button below to secure your account:</p>
            <a href="${resetUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">This link expires in 1 hour. If you did not request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (err: any) {
      console.error('❌ Email Service Error (Auth):', err.message);
      throw err;
    }
  }

  static async notifyNewLead(leadData: any, recipients: string[]) {
    const transporter = this.getTransporter();
    try {
      await transporter.sendMail({
        from: `"Admissions Portal" <${ENV.SMTP.USER}>`,
        to: recipients.join(','),
        subject: `New Application: ${leadData.fullName}`,
        html: `
          <div style="font-family: sans-serif; border: 2px solid #059669; padding: 30px; border-radius: 16px; max-width: 600px; background-color: #f9fafb;">
            <h2 style="color: #059669; margin-top: 0;">New Student Application Received</h2>
            <p style="color: #374151;">A new student has submitted an enrollment request via the website.</p>
            
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <p><strong>Student Name:</strong> ${leadData.fullName}</p>
              <p><strong>Email Address:</strong> ${leadData.email}</p>
              <p><strong>Primary Phone:</strong> ${leadData.phone}</p>
              <p><strong>Target Program:</strong> ${leadData.course}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
              <p><strong>Personal Remarks:</strong></p>
              <p style="font-style: italic; color: #4b5563;">${leadData.message || 'No additional remarks.'}</p>
            </div>
            
            <p style="margin-top: 25px;">
              <a href="http://localhost:3000/#/admin" style="background: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">Manage Lead in Dashboard</a>
            </p>
          </div>
        `
      });
    } catch (err: any) {
      console.error('❌ Email Service Error (Lead):', err.message);
    }
  }
}
