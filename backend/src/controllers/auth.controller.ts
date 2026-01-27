<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; // adjust path if needed

export class AuthService {
  static async login(identifier: string, password: string) {
    // 1️⃣ Find user by email OR username
    const user = await User.findOne({
      where: {
        email: identifier,
      },
    }) || await User.findOne({
      where: {
        username: identifier,
      },
    });
=======

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = (req as any).body;
>>>>>>> 964abf81776e6c021d5871ef98008b5701eb44a1

    // 2️⃣ User not found
    if (!user) {
      return null;
    }

    // 3️⃣ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // 4️⃣ Password incorrect
    if (!isMatch) {
      return null;
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // 6️⃣ Return auth data
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
<<<<<<< HEAD
=======

  /**
   * Public: Initiate password recovery
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = (req as any).body;
      if (!email) return sendResponse(res, 400, false, 'Email address is required');

      await AuthService.requestPasswordReset(email);
      
      // For security, always return success to prevent email enumeration
      return sendResponse(res, 200, true, 'If the email exists, a secure recovery link has been dispatched.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Finalize password reset via secure token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = (req as any).body;
      if (!token || !password) return sendResponse(res, 400, false, 'Missing mandatory recovery credentials');

      await AuthService.resetPassword(token, password);
      return sendResponse(res, 200, true, 'Institutional password updated successfully. Please log in.');
    } catch (error) {
      next(error);
    }
  }
>>>>>>> 19c1a1129c56213386a2dd32e6ffcba8e415a40f
}
