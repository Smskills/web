
import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'eduinsta_cms',
    PORT: parseInt(process.env.DB_PORT || '3306'),
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  },
  EMAIL: {
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT || '587'),
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    FROM: process.env.EMAIL_FROM || '"EduInsta CMS" <no-reply@eduinsta.com>',
  },
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  UPLOAD_LIMIT: '10mb',
};
