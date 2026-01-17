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
}
