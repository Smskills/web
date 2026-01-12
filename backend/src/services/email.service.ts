
// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENV.SMTP.HOST,
    port: ENV.SMTP.PORT,
    secure: ENV.SMTP.SECURE,
    auth: {
      user: ENV.SMTP.USER,
      pass: ENV.SMTP.PASS,
    },
  });

  static async notifyNewLead(leadData: any, recipients: string[]) {
    if (!recipients || recipients.length === 0) return;

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">New ${leadData.source} Query</h2>
        <hr />
        <p><strong>Student Name:</strong> ${leadData.fullName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        <p><strong>Interested Course:</strong> ${leadData.course}</p>
        <p><strong>Message:</strong> ${leadData.message || 'N/A'}</p>
        <div style="margin-top: 20px; padding: 10px; background: #f9f9f9; font-size: 11px;">
            <p>This is an automated alert from your Institute Management System.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"SMS Skills Alerts" <${ENV.SMTP.USER}>`,
        to: recipients.join(', '),
        subject: `New Lead: ${leadData.fullName}`,
        html: htmlContent,
      });
      console.log('✅ Email notification dispatched.');
    } catch (err) {
      console.error('❌ Email dispatch failed:', err);
    }
  }
}
