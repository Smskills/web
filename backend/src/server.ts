import process from 'node:process';
import app from './app';
import pool from './config/database';
import { ENV } from './config/env';

/**
 * BOOTSTRAP SEQUENCE
 * 1. Verify DB connectivity
 * 2. Initialize HTTP listener
 * 3. Bind process safety events
 */
async function bootstrap() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ DATABASE: Connection sequence successful.');
    connection.release();

    app.listen(ENV.PORT, () => {
      console.log(`🚀 SMS SERVER: Active on port ${ENV.PORT}`);
      console.log(`📡 API BASE: http://localhost:${ENV.PORT}/api`);
    });
  } catch (error) {
    console.error('❌ BOOTSTRAP ERROR:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err: Error) => {
  console.error('🔥 CRITICAL: Unhandled Promise Rejection ->', err.message);
  process.exit(1);
});

bootstrap();
