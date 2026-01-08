import app from './app.ts';
import pool from './config/database.ts';
import { ENV } from './config/env.ts';
// Removed redundant process import to favor global node process type definitions and resolve property errors

async function bootstrap() {
  try {
    // Validate Database Connection
    const connection = await pool.getConnection();
    console.log('✅ Database Connection Verified.');
    connection.release();

    app.listen(ENV.PORT, () => {
      console.log(`🚀 SMS Backend listening on port ${ENV.PORT}`);
      console.log(`📡 API URL: http://localhost:${ENV.PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Bootstrap Failure:', error);
    // Use global process.exit for reliable process termination
    process.exit(1);
  }
}

// Handling unhandled promise rejections using global process object to fix "Property 'on' does not exist" error
process.on('unhandledRejection', (err: Error) => {
  console.error('🔥 Unhandled Rejection:', err.message);
  // Termination via global process.exit to fix "Property 'exit' does not exist" error
  process.exit(1);
});

bootstrap();