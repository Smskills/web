import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.ts';
import { errorHandler } from './middleware/error.middleware.ts';
import { ENV } from './config/env.ts';
import { CONSTANTS } from './config/constants.ts';

const app: Application = express();

// 1. Core Security & Logging
// Hardened CORS for production/development consistency
app.use(cors({
  origin: '*', // In production, replace with specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(helmet({ crossOriginResourcePolicy: false }));

if (ENV.NODE_ENV === 'development') app.use(morgan('dev'));

// 2. Request Parsing
app.use(express.json({ limit: ENV.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: ENV.UPLOAD_LIMIT }));

// 3. Static File Access
app.use('/uploads', express.static(CONSTANTS.UPLOADS.ROOT));

// 4. API Core Routing
// Mount the API routes at /api
app.use('/api', apiRoutes);

// 5. Global Error Handler (MUST be last)
app.use(errorHandler);

export default app;