
import mysql from 'mysql2/promise';
import { mockPool } from './mockDb.ts';
import { ENV } from './env.ts';

// Use real MySQL if DB_HOST is provided (standard for production), otherwise fallback to mock
const useRealDb = !!process.env.DB_HOST;

console.log(`🔍 DB Config Check: DB_HOST="${process.env.DB_HOST}", useRealDb=${useRealDb}`);

let pool: any = mockPool;

if (useRealDb) {
  try {
    console.log(`📡 Attempting to connect to MySQL at ${ENV.DB.HOST}:${ENV.DB.PORT}...`);
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
    
    // Test the connection immediately
    (async () => {
      try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to Production MySQL Database');
        connection.release();
      } catch (err: any) {
        console.error('❌ Database Connection Test Failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.log('ℹ️ Falling back to Mock DB');
        pool = mockPool;
      }
    })();
  } catch (err: any) {
    console.error('❌ Failed to initialize MySQL Pool:', err.message);
    console.log('ℹ️ Falling back to Mock DB');
    pool = mockPool;
  }
} else {
  console.log('ℹ️ Using Local Mock Database (db.json)');
}

export default pool;
