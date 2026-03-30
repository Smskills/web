
import pool from '../config/database.ts';

export class CoursesRepository {
  static async getAll() {
    const [rows]: any = await pool.execute(`SELECT * FROM courses ORDER BY created_at DESC`);
    return rows;
  }

  static async findById(id: number | string) {
    const [rows]: any = await pool.execute(`SELECT * FROM courses WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async create(course: any) {
    const keys = Object.keys(course);
    const values = Object.values(course);
    const placeholders = keys.map(() => '?').join(', ');
    
    const [result]: any = await pool.execute(
      `INSERT INTO courses (${keys.join(', ')}) VALUES (${placeholders})`,
      values as any[]
    );
    return result.insertId;
  }

  static async update(id: number | string, course: any) {
    const keys = Object.keys(course);
    const values = Object.values(course);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    await pool.execute(`UPDATE courses SET ${setClause} WHERE id = ?`, [...values, id] as any[]);
    return true;
  }

  static async delete(id: number | string) {
    await pool.execute(`DELETE FROM courses WHERE id = ?`, [id]);
    return true;
  }
}
