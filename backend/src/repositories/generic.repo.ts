import pool from '../config/database.ts';

export class GenericRepository {
  static async getAll(table: string) {
    const [rows] = await pool.execute(`SELECT * FROM ${table}`);
    return rows;
  }

  static async getById(table: string, id: number | string) {
    const [rows]: any = await pool.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0];
  }

  static async create(table: string, data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result]: any = await pool.execute(sql, values as any[]);
    return result.insertId;
  }

  static async update(table: string, id: number | string, data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    await pool.execute(sql, [...values, id] as any[]);
  }

  static async delete(table: string, id: number | string) {
    await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id] as any[]);
  }

  static async deleteAll(table: string) {
    await pool.execute(`DELETE FROM ${table}`);
  }

  static async bulkCreate(table: string, items: any[]) {
    if (items.length === 0) return;
    const keys = Object.keys(items[0]);
    const placeholders = items.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
    const values = items.flatMap(item => Object.values(item));
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${placeholders}`;
    await pool.execute(sql, values as any[]);
  }
}
