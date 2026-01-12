
// Note: Requires nodemailer package
// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  /**
   * Transporter configuration
   */
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  /**
   * Send notification to multiple addresses
   */
  static async notifyNewLead(leadData: any, recipients: string[]) {
    if (!recipients || recipients.length === 0) return;

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #059669;">New ${leadData.source} Application Received</h2>
        <hr />
        <p><strong>Name:</strong> ${leadData.fullName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        <p><strong>Course Track:</strong> ${leadData.course}</p>
        <p><strong>Message:</strong> ${leadData.message || 'N/A'}</p>
        <div style="margin-top: 20px; padding: 10px; background: #f9f9f9;">
            <p style="font-size: 11px; color: #666;">Automated notification from SM Skills Lead Engine.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"Lead Notification" <noreply@smskills.in>',
        to: recipients.join(', '), // Send to multiple recipients
        subject: `New Lead: ${leadData.fullName} [${leadData.course}]`,
        html: htmlContent,
      });
      console.log('✅ Lead notification sent to recipients.');
    } catch (err) {
      console.error('❌ Failed to send lead notification email:', err);
    }
  }
}
