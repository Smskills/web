import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import apiRoutes from './routes/index';
import { errorHandler } from './middleware/error.middleware';
import { ENV } from './config/env';
import { CONSTANTS } from './config/constants';

const app: Application = express();

/**
 * 1. Core Security & Logging
 */
app.use(
  helmet({ crossOriginResourcePolicy: false }) as any
);

/**
 * ✅ CORS — FIXED (EXPLICIT, SAFE)
 * Frontend → Backend communication
 */
app.use(
  cors({
    origin: 'http://localhost:3000', // change to 5173 if using Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }) as any
);

if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev') as any);
}

/**
 * 2. Request Parsing
 */
app.use(express.json({ limit: ENV.UPLOAD_LIMIT }) as any);
app.use(express.urlencoded({ extended: true, limit: ENV.UPLOAD_LIMIT }) as any);

/**
 * 3. Static File Access
 */
app.use('/uploads', express.static(CONSTANTS.UPLOADS.ROOT) as any);

/**
 * 4. API Routing
 * All routes are prefixed with /api
 * Example: POST /api/login
 */
app.use('/api', apiRoutes);

/**
 * 5. Global Error Handler (MUST be last)
 */
app.use(errorHandler);

export default app;
