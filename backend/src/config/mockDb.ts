
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../db.json');

// Initial data based on schema.sql
const INITIAL_DATA = {
  users: [
    {
      id: 1,
      username: 'ADM2026@smskills',
      password: bcrypt.hashSync('Website26@smskills.in', 10),
      email: 'info@smskills.in',
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ],
  site_config: [
    {
      id: 1,
      config_json: '{}'
    }
  ],
  leads: [],
  courses: [],
  notices: [],
  gallery: [],
  faqs: [],
  custom_pages: [],
  placement_stats: [],
  student_reviews: [],
  industry_partners: [],
  career_services: [],
  team_members: [],
  achievement_stats: [],
  extra_chapters: [],
  legal_sections: []
};

class MockPool {
  private data: any;

  constructor() {
    this.loadData();
  }

  private loadData() {
    if (fs.existsSync(DB_PATH)) {
      try {
        this.data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      } catch (e) {
        this.data = { ...INITIAL_DATA };
      }
    } else {
      this.data = { ...INITIAL_DATA };
      this.saveData();
    }
  }

  private saveData() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  async execute(sql: string, params: any[] = []): Promise<[any, any]> {
    const normalizedSql = sql.trim().toLowerCase();
    
    // Very basic SQL parser for mock purposes
    if (normalizedSql.startsWith('select')) {
      return this.handleSelect(normalizedSql, params) as [any, any];
    } else if (normalizedSql.startsWith('insert')) {
      return this.handleInsert(normalizedSql, params) as [any, any];
    } else if (normalizedSql.startsWith('update')) {
      return this.handleUpdate(normalizedSql, params) as [any, any];
    } else if (normalizedSql.startsWith('delete')) {
      return this.handleDelete(normalizedSql, params) as [any, any];
    }

    throw new Error(`Mock DB: Unsupported SQL query: ${sql}`);
  }

  private handleSelect(sql: string, params: any[]) {
    const tableName = this.getTableName(sql);
    let results = [...(this.data[tableName] || [])];

    // Handle basic WHERE clauses (e.g., email = ?, username = ?, id = ?)
    if (sql.includes('where')) {
      const whereClause = sql.split('where')[1].split('order by')[0].split('limit')[0].trim();
      const [field] = whereClause.split('=').map(s => s.trim());
      const value = params[0];
      results = results.filter(row => row[field] === value);
    }

    // Handle ORDER BY
    if (sql.includes('order by')) {
      const orderBy = sql.split('order by')[1].split('limit')[0].trim();
      const [field, direction] = orderBy.split(' ');
      results.sort((a, b) => {
        if (a[field] < b[field]) return direction === 'desc' ? 1 : -1;
        if (a[field] > b[field]) return direction === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return [results, null];
  }

  private handleInsert(sql: string, params: any[]) {
    const tableName = this.getTableName(sql);
    if (!this.data[tableName]) this.data[tableName] = [];

    // Extract fields from INSERT INTO table (f1, f2) VALUES (?, ?)
    const fieldsMatch = sql.match(/\((.*?)\)/);
    if (!fieldsMatch) throw new Error('Invalid INSERT syntax');
    const fields = fieldsMatch[1].split(',').map(f => f.trim());

    const newRow: any = { id: Date.now() };
    fields.forEach((field, index) => {
      newRow[field] = params[index];
    });
    newRow.created_at = new Date().toISOString();

    this.data[tableName].push(newRow);
    this.saveData();

    return [{ insertId: newRow.id }, null];
  }

  private handleUpdate(sql: string, params: any[]) {
    const tableName = this.getTableName(sql);
    const rows = this.data[tableName] || [];

    // Basic UPDATE table SET f1 = ?, f2 = ? WHERE id = ?
    const setPart = sql.split('set')[1].split('where')[0].trim();
    const fields = setPart.split(',').map(s => s.split('=')[0].trim());
    
    const wherePart = sql.split('where')[1].trim();
    const whereField = wherePart.split('=')[0].trim();
    const whereValue = params[params.length - 1];

    let affectedRows = 0;
    this.data[tableName] = rows.map((row: any) => {
      if (row[whereField] === whereValue) {
        affectedRows++;
        fields.forEach((field, index) => {
          row[field] = params[index];
        });
        row.updated_at = new Date().toISOString();
      }
      return row;
    });

    this.saveData();
    return [{ affectedRows }, null];
  }

  private handleDelete(sql: string, params: any[]) {
    const tableName = this.getTableName(sql);
    const wherePart = sql.split('where')[1].trim();
    const whereField = wherePart.split('=')[0].trim();
    const whereValue = params[0];

    const initialCount = this.data[tableName].length;
    this.data[tableName] = this.data[tableName].filter((row: any) => row[whereField] !== whereValue);
    const affectedRows = initialCount - this.data[tableName].length;

    this.saveData();
    return [{ affectedRows }, null];
  }

  private getTableName(sql: string): string {
    const parts = sql.split(' ');
    if (parts[0] === 'select') return parts[parts.indexOf('from') + 1].replace(/;/g, '');
    if (parts[0] === 'insert') return parts[2].replace(/;/g, '');
    if (parts[0] === 'update') return parts[1].replace(/;/g, '');
    if (parts[0] === 'delete') return parts[parts.indexOf('from') + 1].replace(/;/g, '');
    return '';
  }
}

export const mockPool = new MockPool();
