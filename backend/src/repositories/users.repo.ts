
import pool from '../config/database.ts';

export class UsersRepository {
  static async findByEmail(email: string) {
    const [rows]: any = await pool.execute(`SELECT * FROM \`users\` WHERE \`email\` = ?`, [email]);
    return rows[0] || null;
  }

  static async findByUsername(username: string) {
    const [rows]: any = await pool.execute(`SELECT * FROM \`users\` WHERE \`username\` = ?`, [username]);
    return rows[0] || null;
  }

  static async findByResetToken(token: string) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM \`users\` WHERE \`reset_token\` = ? AND \`reset_token_expiry\` > NOW()`,
      [token]
    );
    return rows[0] || null;
  }

  static async updateResetToken(userId: number, token: string | null, expiry: Date | null) {
    await pool.execute(
      `UPDATE \`users\` SET \`reset_token\` = ?, \`reset_token_expiry\` = ? WHERE \`id\` = ?`,
      [token, expiry, userId]
    );
  }

  static async updatePassword(userId: number, passwordHash: string) {
    await pool.execute(
      `UPDATE \`users\` SET \`password\` = ?, \`reset_token\` = NULL, \`reset_token_expiry\` = NULL WHERE \`id\` = ?`,
      [passwordHash, userId]
    );
  }
}
