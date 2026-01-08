import pool from '../config/database';

export class CoursesRepository {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM courses WHERE status = "Active"');
    return rows;
  }

  static async getById(id: string) {
    const [rows]: any = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
    return rows[0];
  }
}