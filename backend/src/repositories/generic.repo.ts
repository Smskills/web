
import pool from '../config/database.ts';

export class GenericRepository {
  static async findOne(table: string, id: number | string) {
    const [rows]: any = await pool.execute(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  static async update(table: string, id: number | string, data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');
    
    await pool.execute(`UPDATE \`${table}\` SET ${setClause} WHERE id = ?`, [...values, id] as any[]);
    return true;
  }

  static async create(table: string, data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const [result]: any = await pool.execute(
      `INSERT INTO \`${table}\` (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`,
      values as any[]
    );
    return result.insertId;
  }

  static async findAll(table: string) {
    const [rows]: any = await pool.execute(`SELECT * FROM \`${table}\``);
    return rows;
  }

  static async delete(table: string, id: number | string) {
    await pool.execute(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    return true;
  }
}
