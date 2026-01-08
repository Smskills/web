import app from './app';
import pool from './config/db';
import dotenv from 'dotenv';
// Fix: Explicitly import 'process' to ensure proper type definitions for .exit() and .on() in TypeScript
import process from 'process';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Test Database Connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully.');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    // Fix: Using correctly typed process.exit
    process.exit(1);
  }
}

// Handle unhandled rejections
// Fix: Using correctly typed process.on for event listening
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

bootstrap();