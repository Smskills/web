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
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
if (ENV.NODE_ENV === 'development') app.use(morgan('dev'));

// 2. Request Parsing
app.use(express.json({ limit: ENV.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: ENV.UPLOAD_LIMIT }));

// 3. Static File Access
app.use('/uploads', express.static(CONSTANTS.UPLOADS.ROOT));

// 4. API Core Routing (Routes are aggregated in routes/index.ts)
app.use('/api', apiRoutes);

// 5. Global Error Handler (MUST be last)
app.use(errorHandler);

export default app;