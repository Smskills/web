import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASS: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'sms_skills_db',
    PORT: parseInt(process.env.DB_PORT || '3306'),
  },
  JWT_SECRET: process.env.JWT_SECRET || 'institutional_default_secret_key_2024',
  UPLOAD_LIMIT: process.env.UPLOAD_LIMIT || '10mb'
};