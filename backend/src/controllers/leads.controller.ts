
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database.ts';
import { sendResponse } from '../utils/response.ts';
import { EmailService } from '../services/email.service.ts';
import { mapToCamelCase } from '../utils/mapper.ts';

export class LeadsController {
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, course, message, source, details } = req.body;
      
      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Full Name, Email, and Phone are required');
      }

      const [result]: any = await pool.execute(
        `INSERT INTO leads (full_name, email, phone, course, message, source, details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
      );

      // Attempt to send email notification
      try {
        await EmailService.sendLeadNotification({ fullName, email, phone, course, message });
      } catch (emailErr) {
        console.error('📧 Email Notification Failed:', emailErr);
      }

      return sendResponse(res, 201, true, 'Lead submitted successfully', { id: result.insertId });
    } catch (err) {
      next(err);
    }
  }

  static async getLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows]: any = await pool.execute(`SELECT * FROM leads ORDER BY created_at DESC`);
      const leads = mapToCamelCase(rows);
      
      return sendResponse(res, 200, true, 'Leads fetched successfully', leads);
    } catch (err) {
      next(err);
    }
  }
}
