
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UsersRepository } from '../repositories/users.repo.ts';
import { ENV } from '../config/env.ts';
import { EmailService } from './email.service.ts';

export class AuthService {
  static async login(identifier: string, password: string) {
    // Identifier can be email or username
    let user = await UsersRepository.findByEmail(identifier);
    if (!user) {
      user = await UsersRepository.findByUsername(identifier);
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      ENV.JWT.SECRET,
      { expiresIn: ENV.JWT.EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async forgotPassword(email: string) {
    const user = await UsersRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await UsersRepository.updateResetToken(user.id, resetToken, resetTokenExpiry);
    
    try {
      await EmailService.sendPasswordReset(email, resetToken);
    } catch (err) {
      console.error('📧 Forgot Password Email Failed:', err);
    }
    
    return true;
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await UsersRepository.findByResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UsersRepository.updatePassword(user.id, passwordHash);
    
    return true;
  }
}
