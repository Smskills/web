
import mysql from 'mysql2/promise';
import { mockPool } from './mockDb.ts';
import { ENV } from './env.ts';

// Use real MySQL if DB_USER is provided (standard for production), otherwise fallback to mock
const useRealDb = process.env.DB_USER && process.env.DB_USER !== 'root';

let pool: any = mockPool;

if (useRealDb) {
  try {
    pool = mysql.createPool({
      host: ENV.DB.HOST,
      user: ENV.DB.USER,
      password: ENV.DB.PASSWORD,
      database: ENV.DB.NAME,
      port: ENV.DB.PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('✅ Connected to Production MySQL Database');
  } catch (err) {
    console.error('❌ Failed to connect to Production MySQL, falling back to Mock DB');
    pool = mockPool;
  }
} else {
  console.log('ℹ️ Using Local Mock Database (db.json)');
}

export default pool;
