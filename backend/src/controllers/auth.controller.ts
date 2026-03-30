
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.ts';
import { sendResponse } from '../utils/response.ts';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;
      
      if (!identifier || !password) {
        return sendResponse(res, 400, false, 'Identifier and password are required');
      }

      const result = await AuthService.login(identifier, password);
      return sendResponse(res, 200, true, 'Login successful', result);
    } catch (err: any) {
      return sendResponse(res, 401, false, err.message || 'Login failed');
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) return sendResponse(res, 400, false, 'Email is required');

      await AuthService.forgotPassword(email);
      return sendResponse(res, 200, true, 'If an account with that email exists, a reset link has been sent.');
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return sendResponse(res, 400, false, 'Token and new password are required');

      await AuthService.resetPassword(token, newPassword);
      return sendResponse(res, 200, true, 'Password reset successful. You can now login with your new password.');
    } catch (err: any) {
      return sendResponse(res, 400, false, err.message || 'Password reset failed');
    }
  }
}
