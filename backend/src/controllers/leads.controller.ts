import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';
import { EmailService } from '../services/email.service'; 

export class LeadsController {
  /**
   * Create a new lead from Website form
   */
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, course, message, source, details } = (req as any).body;

      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Required fields: Name, Email, and Phone are mandatory.');
      }

      const [result]: any = await pool.execute(
        'INSERT INTO leads (full_name, email, phone, course, message, source, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, "New", ?, NOW())',
        [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
      );

      // Trigger Email Notification ONLY for applications (source: enrollment)
      if (source === 'enrollment') {
        (async () => {
          try {
            // Fetch the current site configuration from database
            const [configRows]: any = await pool.execute('SELECT config_json FROM site_config WHERE id = 1');
            
            if (configRows.length > 0) {
              const fullState = JSON.parse(configRows[0].config_json);
              // The Admin Panel saves the whole state, notification emails are under state.site
              const recipients = fullState.site?.notificationEmails || [];

              if (recipients.length > 0) {
                console.log(`📧 Dispatching application alert to: ${recipients.join(', ')}`);
                await EmailService.notifyNewLead((req as any).body, recipients);
              } else {
                console.warn('⚠️ No notification emails configured in Admin Panel > Site Tab.');
              }
            }
          } catch (err: any) {
            console.error("❌ Email Dispatch Failed:", err.message);
          }
        })();
      }

      return sendResponse(res, 201, true, 'Your application has been received.', { id: result.insertId });
    } catch (error) {
      next(error);
    }
  }

  static async getAllLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
      return sendResponse(res, 200, true, 'Leads retrieved', rows);
    } catch (error) {
      next(error);
    }
  }

  static async updateLeadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      const { status } = (req as any).body;
      await pool.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
      return sendResponse(res, 200, true, 'Status updated');
    } catch (error) {
      next(error);
    }
  }

  static async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
      return sendResponse(res, 200, true, 'Lead removed');
    } catch (error) {
      next(error);
    }
  }
}
