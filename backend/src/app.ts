import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/error.middleware';
import { ENV } from './config/env';
import { CONSTANTS } from './config/constants';

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
const apiMiddleware = (apiRoutes as any).default || apiRoutes;
if (apiMiddleware && typeof apiMiddleware === 'function') {
  // Mount the API routes directly at the root of this app/router
  // server.ts will mount this app at /api
  app.use('/', apiMiddleware);
}

// 5. Global Error Handler (MUST be last)
const errorMiddleware = (errorHandler as any).default || errorHandler;
if (errorMiddleware && typeof errorMiddleware === 'function') {
  app.use(errorMiddleware);
}

export default app;