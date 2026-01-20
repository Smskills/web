
// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENV.SMTP.HOST,
    port: ENV.SMTP.PORT,
    secure: ENV.SMTP.SECURE, // false for 587, true for 465
    auth: {
      user: ENV.SMTP.USER,
      pass: ENV.SMTP.PASS,
    },
    tls: {
      // Helps avoid connection issues on some networks/localhosts
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    debug: true, // Enable debug output in the terminal
    logger: true  // Log information to the console
  });

  /**
   * Sends a secure recovery link to the administrator.
   */
  static async sendPasswordResetLink(email: string, token: string, username: string) {
    const resetUrl = `http://localhost:3000/#/reset-password?token=${token}`;
    
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 40px; background: #f8fafc; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background: #0f172a; padding: 30px; text-align: center;">
            <h1 style="color: #10b981; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">S M Skills</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 1px;">Access Recovery Protocol</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="margin-top: 0; font-size: 20px; color: #0f172a;">Password Reset Request</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Hello <strong>${username}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">We received a request to reset your administrator password for the S M Skills Portal.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: #059669; color: #ffffff; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Reset My Password</a>
            </div>

            <p style="font-size: 12px; color: #64748b; background: #f1f5f9; padding: 15px; border-radius: 10px; text-align: center;">
              This link is valid for <strong>60 minutes</strong>.
            </p>
          </div>
        </div>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"S M Skills Security" <${ENV.SMTP.USER}>`,
        to: email,
        subject: "Action Required: Reset Your Password",
        html: htmlContent,
      });
      console.log('✅ Email Service: Recovery link sent:', info.messageId);
    } catch (err: any) {
      console.error('❌ Email Service Error (Recovery):', err.message);
      if (err.code === 'EAUTH') {
        console.error('👉 TIP: Gmail rejected your credentials. Check that SMTP_USER is correct and SMTP_PASS is a 16-character App Password (no spaces needed but accepted).');
      }
      throw err;
    }
  }

  /**
   * Notify staff of a new enquiry
   */
  static async notifyNewLead(leadData: any, recipients: string[]) {
    if (!recipients || recipients.length === 0) {
      console.warn('⚠️ Email Service: No recipient emails configured in Admin Dashboard.');
      return;
    }

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
        <h2 style="color: #059669; margin-top: 0;">New ${leadData.source === 'enrollment' ? 'Enrollment Application' : 'General Enquiry'}</h2>
        <p style="color: #666; font-size: 14px;">A new submission was received on the S M Skills website.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Name:</strong> ${leadData.fullName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        <p><strong>Course:</strong> ${leadData.course}</p>
        <p><strong>Message:</strong> ${leadData.message || 'N/A'}</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"S M Skills Portal" <${ENV.SMTP.USER}>`,
        to: recipients.join(', '),
        subject: `New Lead: ${leadData.fullName}`,
        html: htmlContent,
      });
      console.log('✅ Email Service: Lead notification sent to:', recipients.join(', '));
    } catch (err: any) {
      console.error('❌ Email Service Error (Notification):', err.message);
    }
  }
}
