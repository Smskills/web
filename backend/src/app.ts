import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.ts';
import { errorHandler } from './middleware/error.middleware.ts';
import { ENV } from './config/env.ts';
import { CONSTANTS } from './config/constants.ts';

const app: Application = express();

// 1. Security & Logging
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
if (ENV.NODE_ENV === 'development') app.use(morgan('dev'));

// 2. Parsing
app.use(express.json({ limit: ENV.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: ENV.UPLOAD_LIMIT }));

// 3. Static File Serving (Mapped from Constants)
app.use('/uploads', express.static(CONSTANTS.UPLOADS.ROOT));

// 4. Global API Routing
app.use('/api', apiRoutes);

// 5. Central Error Handling (Catch-all)
app.use(errorHandler);

export default app;